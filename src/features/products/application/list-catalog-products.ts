import "server-only";

import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  inArray,
  isNull,
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { getDb } from "@/db/client";
import {
  categories,
  mediaAssets,
  orderItems,
  productCategories,
  products,
} from "@/db/schema";
import type { CatalogListFilter } from "@/features/products/schemas/catalog-list";
import { resolveProductPrices } from "@/features/promotions/application/resolve-product-prices";
import type {
  CatalogProduct,
  ProductCategoryRef,
} from "@/features/products/types";
import {
  CACHE_TAGS,
  PUBLIC_CACHE_REVALIDATE_SECONDS,
} from "@/lib/cache/tags";
import type { Locale } from "@/lib/i18n/config";
import { getCheckoutRateSnapshot } from "@/lib/fx/service";
import { convertAmountToBase } from "@/lib/money/convert";
import type { Currency } from "@/lib/money/currency";
import { defaultCurrency } from "@/lib/money/currency";
import { getCurrencyMeta } from "@/lib/money/currency-meta";
import { mediaPublicUrl } from "@/lib/media/public-url";

export type CatalogListItem = CatalogProduct & {
  category: ProductCategoryRef | null;
  badgeLabel: string | null;
  specsSummary: string | null;
};

export type CatalogCategoryOption = {
  slug: string;
  title: string;
  productCount: number;
};

export type CatalogListResult = {
  products: CatalogListItem[];
  total: number;
  pageSize: number;
  page: number;
  categories: CatalogCategoryOption[];
};

function toBaseCatalogProduct(
  product: typeof products.$inferSelect,
  locale: Locale,
  imageUrl: string | null,
): Omit<
  CatalogProduct,
  "priceAmount" | "compareAtAmount" | "discountPercent" | "listPriceAmount"
> | null {
  const translation = product.translations[locale] ?? product.translations.hy;
  if (!translation) {
    return null;
  }

  return {
    id: product.id,
    sku: product.sku,
    stockOnHand: product.stockOnHand,
    translation,
    imageUrl,
  };
}

function displayMajorToAmd(
  majorUnits: number,
  currency: Currency,
  rate: string,
): number {
  const meta = getCurrencyMeta(currency);
  const minor = BigInt(majorUnits) * 10n ** BigInt(meta.scale);
  const amd = convertAmountToBase(minor, rate, currency, defaultCurrency);
  return Number(amd.amount);
}

async function resolvePriceBoundsAmd(
  filters: CatalogListFilter,
  displayCurrency: Currency,
): Promise<{ minAmd?: number; maxAmd?: number }> {
  if (filters.minPrice == null && filters.maxPrice == null) {
    return {};
  }

  const quote = await getCheckoutRateSnapshot(displayCurrency);
  return {
    minAmd:
      filters.minPrice != null
        ? displayMajorToAmd(filters.minPrice, displayCurrency, quote.rate)
        : undefined,
    maxAmd:
      filters.maxPrice != null
        ? displayMajorToAmd(filters.maxPrice, displayCurrency, quote.rate)
        : undefined,
  };
}

async function resolveCategoryId(
  locale: Locale,
  slug: string | undefined,
): Promise<string | undefined> {
  if (!slug) return undefined;

  const [row] = await getDb()
    .select({ id: categories.id })
    .from(categories)
    .where(
      and(
        eq(categories.status, "ACTIVE"),
        isNull(categories.deletedAt),
        sql`${categories.translations}->${locale}->>'slug' = ${slug}`,
      ),
    )
    .limit(1);

  return row?.id;
}

async function loadCatalogCategoryOptions(
  locale: Locale,
): Promise<CatalogCategoryOption[]> {
  const rows = await getDb()
    .select({
      id: categories.id,
      translations: categories.translations,
      sortOrder: categories.sortOrder,
      productCount: sql<number>`coalesce(count(${productCategories.productId}) filter (
        where ${products.status} = 'ACTIVE' and ${products.deletedAt} is null
      ), 0)::int`,
    })
    .from(categories)
    .leftJoin(
      productCategories,
      eq(productCategories.categoryId, categories.id),
    )
    .leftJoin(products, eq(products.id, productCategories.productId))
    .where(and(eq(categories.status, "ACTIVE"), isNull(categories.deletedAt)))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder), asc(categories.createdAt));

  return rows
    .map((row) => {
      const translation = row.translations[locale] ?? row.translations.hy;
      if (!translation) return null;
      return {
        slug: translation.slug,
        title: translation.title,
        productCount: row.productCount,
      } satisfies CatalogCategoryOption;
    })
    .filter((row): row is CatalogCategoryOption => row !== null);
}

async function loadPrimaryImages(
  productIds: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (productIds.length === 0) return map;

  const rows = await getDb()
    .select({
      productId: mediaAssets.productId,
      objectKey: mediaAssets.objectKey,
      isPrimary: mediaAssets.isPrimary,
      role: mediaAssets.role,
      sortOrder: mediaAssets.sortOrder,
    })
    .from(mediaAssets)
    .where(
      and(
        inArray(mediaAssets.productId, productIds),
        eq(mediaAssets.uploadStatus, "READY"),
        or(eq(mediaAssets.isPrimary, true), eq(mediaAssets.role, "PRIMARY")),
      ),
    )
    .orderBy(asc(mediaAssets.sortOrder));

  for (const row of rows) {
    if (!row.productId || map.has(row.productId)) continue;
    map.set(row.productId, mediaPublicUrl(row.objectKey));
  }

  return map;
}

async function loadPrimaryCategories(
  productIds: string[],
  locale: Locale,
): Promise<Map<string, ProductCategoryRef>> {
  const map = new Map<string, ProductCategoryRef>();
  if (productIds.length === 0) return map;

  const rows = await getDb()
    .select({
      productId: productCategories.productId,
      id: categories.id,
      translations: categories.translations,
      isPrimary: productCategories.isPrimary,
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
    .orderBy(
      desc(productCategories.isPrimary),
      asc(productCategories.sortOrder),
    );

  for (const row of rows) {
    if (map.has(row.productId)) continue;
    const translation = row.translations[locale] ?? row.translations.hy;
    if (!translation) continue;
    map.set(row.productId, {
      id: row.id,
      title: translation.title,
      slug: translation.slug,
    });
  }

  return map;
}

function buildWhere(
  locale: Locale,
  filters: CatalogListFilter,
  categoryId: string | undefined,
  minAmd: number | undefined,
  maxAmd: number | undefined,
): SQL | undefined {
  const conditions: SQL[] = [
    eq(products.status, "ACTIVE"),
    isNull(products.deletedAt),
  ];

  if (filters.q) {
    const pattern = `%${filters.q}%`;
    conditions.push(
      or(
        sql`${products.translations}->${locale}->>'title' ILIKE ${pattern}`,
        sql`${products.translations}->${locale}->>'description' ILIKE ${pattern}`,
        sql`${products.translations}->'hy'->>'title' ILIKE ${pattern}`,
        ilikeSku(pattern),
      )!,
    );
  }

  if (filters.inStock === true) {
    conditions.push(gt(products.stockOnHand, 0));
  } else if (filters.inStock === false) {
    conditions.push(eq(products.stockOnHand, 0));
  }

  if (minAmd != null) {
    conditions.push(gte(products.priceAmount, minAmd));
  }
  if (maxAmd != null) {
    conditions.push(lte(products.priceAmount, maxAmd));
  }

  if (categoryId) {
    conditions.push(
      sql`exists (
        select 1 from ${productCategories}
        where ${productCategories.productId} = ${products.id}
          and ${productCategories.categoryId} = ${categoryId}
      )`,
    );
  }

  return and(...conditions);
}

function ilikeSku(pattern: string): SQL {
  return sql`${products.sku} ILIKE ${pattern}`;
}

function orderByClause(filters: CatalogListFilter) {
  const soldQty = sql<number>`coalesce((
    select sum(${orderItems.quantity})
    from ${orderItems}
    where ${orderItems.productId} = ${products.id}
  ), 0)`;

  switch (filters.sort) {
    case "price_asc":
      return [asc(products.priceAmount), asc(products.id)] as const;
    case "price_desc":
      return [desc(products.priceAmount), asc(products.id)] as const;
    case "popular":
      return [desc(soldQty), desc(products.createdAt), asc(products.id)] as const;
    case "newest":
    default:
      return [desc(products.createdAt), asc(products.id)] as const;
  }
}

async function loadCatalogProductsPage(
  locale: Locale,
  filters: CatalogListFilter,
  displayCurrency: Currency,
): Promise<CatalogListResult> {
  const [{ minAmd, maxAmd }, categoryId, categoryOptions] = await Promise.all([
    resolvePriceBoundsAmd(filters, displayCurrency),
    resolveCategoryId(locale, filters.category),
    loadCatalogCategoryOptions(locale),
  ]);

  // Invalid category slug → empty result set (safe normalize).
  if (filters.category && !categoryId) {
    return {
      products: [],
      total: 0,
      pageSize: filters.pageSize,
      page: 1,
      categories: categoryOptions,
    };
  }

  const where = buildWhere(locale, filters, categoryId, minAmd, maxAmd);
  const offset = (filters.page - 1) * filters.pageSize;

  const [[countRow], rows] = await Promise.all([
    getDb()
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(where),
    getDb()
      .select()
      .from(products)
      .where(where)
      .orderBy(...orderByClause(filters))
      .limit(filters.pageSize)
      .offset(offset),
  ]);

  const productIds = rows.map((row) => row.id);
  const [images, prices, primaryCategories] = await Promise.all([
    loadPrimaryImages(productIds),
    resolveProductPrices(
      rows.map((row) => ({
        id: row.id,
        priceAmount: row.priceAmount,
        compareAtAmount: row.compareAtAmount,
      })),
    ),
    loadPrimaryCategories(productIds, locale),
  ]);

  const enriched = rows
    .map((product) => {
      const base = toBaseCatalogProduct(
        product,
        locale,
        images.get(product.id) ?? null,
      );
      if (!base) return null;

      const resolved = prices.get(product.id);
      const translation =
        product.translations[locale] ?? product.translations.hy;
      const badgeLabel =
        product.badgeTranslations?.[locale] ??
        product.badgeTranslations?.hy ??
        null;
      const specsSummary = translation?.description?.trim() || null;

      return {
        ...base,
        listPriceAmount: resolved?.listAmount ?? product.priceAmount,
        priceAmount: resolved?.unitAmount ?? product.priceAmount,
        compareAtAmount: resolved?.compareAtAmount ?? null,
        discountPercent: resolved?.discountPercent ?? null,
        category: primaryCategories.get(product.id) ?? null,
        badgeLabel,
        specsSummary,
      } satisfies CatalogListItem;
    })
    .filter((product): product is CatalogListItem => product !== null);

  return {
    products: enriched,
    total: countRow?.count ?? 0,
    pageSize: filters.pageSize,
    page: filters.page,
    categories: categoryOptions,
  };
}

function cacheKeyForFilters(
  locale: Locale,
  filters: CatalogListFilter,
  displayCurrency: Currency,
): string[] {
  return [
    "catalog-products-page",
    locale,
    displayCurrency,
    filters.q ?? "",
    String(filters.minPrice ?? ""),
    String(filters.maxPrice ?? ""),
    filters.category ?? "",
    String(filters.inStock ?? ""),
    filters.sort,
    String(filters.page),
    String(filters.pageSize),
  ];
}

/** Filtered/sorted/paginated storefront catalog (tag-cached). */
export async function listCatalogProducts(
  locale: Locale,
  filters: CatalogListFilter,
  displayCurrency: Currency,
): Promise<CatalogListResult> {
  return unstable_cache(
    async () => loadCatalogProductsPage(locale, filters, displayCurrency),
    cacheKeyForFilters(locale, filters, displayCurrency),
    {
      tags: [CACHE_TAGS.products],
      revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
    },
  )();
}
