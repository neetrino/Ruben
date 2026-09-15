import "server-only";

import { and, asc, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDb } from "@/db/client";
import {
  categories,
  compareItems,
  productCategories,
  products,
} from "@/db/schema";
import { COMPARE_MAX_PRODUCTS } from "@/features/compare/constants";
import {
  peekGuestCompareIds,
  setGuestCompareIds,
} from "@/features/compare/guest-compare";
import type { CompareProduct } from "@/features/compare/types";
import {
  getActiveProductsByIds,
  type ProductCategoryRef,
} from "@/features/products/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { createId } from "@/lib/id";
import type { Locale } from "@/lib/i18n/config";

/** Returns compare list item count for the viewer (signed-in or guest). */
export async function getCompareCount(): Promise<number> {
  const user = await getCurrentUser();
  if (!user) {
    return (await peekGuestCompareIds()).length;
  }

  const [row] = await getDb()
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(compareItems)
    .where(eq(compareItems.userId, user.id));

  return row?.count ?? 0;
}

/** Product IDs currently on the viewer's compare list. */
export async function getCompareProductIds(
  productIds?: string[],
): Promise<Set<string>> {
  const user = await getCurrentUser();
  if (!user) {
    const guestIds = await peekGuestCompareIds();
    if (!productIds || productIds.length === 0) {
      return new Set(guestIds);
    }
    const wanted = new Set(productIds);
    return new Set(guestIds.filter((id) => wanted.has(id)));
  }

  const conditions = [eq(compareItems.userId, user.id)];
  if (productIds && productIds.length > 0) {
    conditions.push(inArray(compareItems.productId, productIds));
  }

  const rows = await getDb()
    .select({ productId: compareItems.productId })
    .from(compareItems)
    .where(and(...conditions));

  return new Set(rows.map((row) => row.productId));
}

/** Whether a product is on the viewer's compare list. */
export async function isProductInCompare(productId: string): Promise<boolean> {
  const ids = await getCompareProductIds([productId]);
  return ids.has(productId);
}

async function loadCategoriesByProductIds(
  productIds: string[],
  locale: Locale,
): Promise<Map<string, ProductCategoryRef[]>> {
  const map = new Map<string, ProductCategoryRef[]>();
  if (productIds.length === 0) {
    return map;
  }

  const rows = await getDb()
    .select({
      productId: productCategories.productId,
      id: categories.id,
      translations: categories.translations,
      sortOrder: productCategories.sortOrder,
    })
    .from(productCategories)
    .innerJoin(categories, eq(productCategories.categoryId, categories.id))
    .where(
      and(
        inArray(productCategories.productId, productIds),
        eq(categories.status, "ACTIVE"),
        isNull(categories.deletedAt),
      ),
    )
    .orderBy(asc(productCategories.sortOrder));

  for (const row of rows) {
    const translation = row.translations[locale] ?? row.translations.hy;
    if (!translation) {
      continue;
    }
    const list = map.get(row.productId) ?? [];
    list.push({
      id: row.id,
      title: translation.title,
      slug: translation.slug,
    });
    map.set(row.productId, list);
  }

  return map;
}

async function loadCompareProductsByOrderedIds(
  locale: Locale,
  comparedIds: string[],
): Promise<CompareProduct[]> {
  if (comparedIds.length === 0) {
    return [];
  }

  const [active, categoriesByProduct] = await Promise.all([
    getActiveProductsByIds(locale, comparedIds),
    loadCategoriesByProductIds(comparedIds, locale),
  ]);
  const byId = new Map(active.map((product) => [product.id, product]));

  return comparedIds
    .map((id) => {
      const product = byId.get(id);
      if (!product) {
        return null;
      }
      return {
        ...product,
        categories: categoriesByProduct.get(id) ?? [],
      } satisfies CompareProduct;
    })
    .filter((product): product is CompareProduct => product != null);
}

/**
 * Active catalog products on the viewer's compare list
 * (ordered by compare add time, newest first).
 */
export async function listCompareProducts(
  locale: Locale,
): Promise<CompareProduct[]> {
  const user = await getCurrentUser();
  if (!user) {
    return loadCompareProductsByOrderedIds(locale, await peekGuestCompareIds());
  }

  const links = await getDb()
    .select({ productId: compareItems.productId })
    .from(compareItems)
    .where(eq(compareItems.userId, user.id))
    .orderBy(desc(compareItems.createdAt));

  return loadCompareProductsByOrderedIds(
    locale,
    links.map((row) => row.productId),
  );
}

async function assertActiveProduct(productId: string): Promise<void> {
  const [product] = await getDb()
    .select({
      id: products.id,
      status: products.status,
      deletedAt: products.deletedAt,
    })
    .from(products)
    .where(and(eq(products.id, productId), isNull(products.deletedAt)))
    .limit(1);

  if (!product || product.status !== "ACTIVE") {
    throw new Error("PRODUCT_UNAVAILABLE");
  }
}

async function toggleGuestCompare(productId: string): Promise<{
  inCompare: boolean;
}> {
  await assertActiveProduct(productId);

  const current = await peekGuestCompareIds();
  if (current.includes(productId)) {
    await setGuestCompareIds(current.filter((id) => id !== productId));
    revalidateComparePaths();
    return { inCompare: false };
  }

  if (current.length >= COMPARE_MAX_PRODUCTS) {
    throw new Error("COMPARE_LIMIT");
  }

  await setGuestCompareIds([productId, ...current]);
  revalidateComparePaths();
  return { inCompare: true };
}

/**
 * Adds or removes a product from the viewer's compare list
 * (DB for signed-in users, cookie for guests).
 */
export async function toggleCompare(productId: string): Promise<{
  inCompare: boolean;
}> {
  const user = await getCurrentUser();
  if (!user) {
    return toggleGuestCompare(productId);
  }

  await assertActiveProduct(productId);

  const [existing] = await getDb()
    .select({ id: compareItems.id })
    .from(compareItems)
    .where(
      and(
        eq(compareItems.userId, user.id),
        eq(compareItems.productId, productId),
      ),
    )
    .limit(1);

  if (existing) {
    await getDb().delete(compareItems).where(eq(compareItems.id, existing.id));
    revalidateComparePaths();
    return { inCompare: false };
  }

  const [countRow] = await getDb()
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(compareItems)
    .where(eq(compareItems.userId, user.id));

  if ((countRow?.count ?? 0) >= COMPARE_MAX_PRODUCTS) {
    throw new Error("COMPARE_LIMIT");
  }

  await getDb().insert(compareItems).values({
    id: createId(),
    userId: user.id,
    productId,
  });
  revalidateComparePaths();
  return { inCompare: true };
}

/** Removes every product from the viewer's compare list. */
export async function clearCompare(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    await setGuestCompareIds([]);
    revalidateComparePaths();
    return;
  }

  await getDb().delete(compareItems).where(eq(compareItems.userId, user.id));
  revalidateComparePaths();
}

function revalidateComparePaths(): void {
  revalidatePath("/", "layout");
}
