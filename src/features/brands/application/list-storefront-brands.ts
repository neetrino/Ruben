import "server-only";

import { and, asc, eq, isNotNull, isNull, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { getDb } from "@/db/client";
import { brands, mediaAssets, type LocaleTranslation } from "@/db/schema";
import { HOME_PARTNER_BRANDS_LIMIT } from "@/features/brands/domain/home-partners";
import {
  CACHE_TAGS,
  PUBLIC_CACHE_REVALIDATE_SECONDS,
} from "@/lib/cache/tags";
import type { Locale } from "@/lib/i18n/config";
import { mediaPublicUrl } from "@/lib/media/public-url";

export type StorefrontBrandItem = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  sortOrder: number;
};

function translationFor(
  translations: (typeof brands.$inferSelect)["translations"],
  locale: Locale,
): LocaleTranslation | null {
  return translations[locale] ?? translations.hy ?? translations.en ?? null;
}

async function loadBrandImages(
  brandIds: readonly string[],
): Promise<Map<string, string>> {
  const images = new Map<string, string>();
  if (brandIds.length === 0) return images;

  const mediaRows = await getDb()
    .select({
      brandId: mediaAssets.brandId,
      objectKey: mediaAssets.objectKey,
    })
    .from(mediaAssets)
    .where(
      and(
        isNotNull(mediaAssets.brandId),
        eq(mediaAssets.uploadStatus, "READY"),
        or(
          eq(mediaAssets.isPrimary, true),
          eq(mediaAssets.role, "PRIMARY"),
          eq(mediaAssets.role, "COVER"),
        ),
      ),
    );

  const idSet = new Set(brandIds);
  for (const media of mediaRows) {
    if (!media.brandId || !idSet.has(media.brandId) || images.has(media.brandId)) {
      continue;
    }
    images.set(media.brandId, mediaPublicUrl(media.objectKey));
  }

  return images;
}

function mapBrandRows(
  rows: Array<{
    id: string;
    translations: (typeof brands.$inferSelect)["translations"];
    sortOrder: number;
  }>,
  locale: Locale,
  images: Map<string, string>,
): StorefrontBrandItem[] {
  return rows
    .map((row) => {
      const translation = translationFor(row.translations, locale);
      if (!translation?.title || !translation.slug) return null;
      return {
        id: row.id,
        title: translation.title,
        slug: translation.slug,
        imageUrl: images.get(row.id) ?? null,
        sortOrder: row.sortOrder,
      } satisfies StorefrontBrandItem;
    })
    .filter((row): row is StorefrontBrandItem => row !== null);
}

async function loadStorefrontBrands(
  locale: Locale,
): Promise<StorefrontBrandItem[]> {
  const rows = await getDb()
    .select({
      id: brands.id,
      translations: brands.translations,
      sortOrder: brands.sortOrder,
    })
    .from(brands)
    .where(and(eq(brands.status, "ACTIVE"), isNull(brands.deletedAt)))
    .orderBy(asc(brands.sortOrder), asc(brands.createdAt));

  const images = await loadBrandImages(rows.map((row) => row.id));
  return mapBrandRows(rows, locale, images);
}

async function loadHomePartnerBrands(
  locale: Locale,
): Promise<StorefrontBrandItem[]> {
  const rows = await getDb()
    .select({
      id: brands.id,
      translations: brands.translations,
      sortOrder: brands.sortOrder,
    })
    .from(brands)
    .where(
      and(
        eq(brands.status, "ACTIVE"),
        eq(brands.isFeatured, true),
        isNull(brands.deletedAt),
      ),
    )
    .orderBy(asc(brands.sortOrder), asc(brands.createdAt))
    .limit(HOME_PARTNER_BRANDS_LIMIT);

  const images = await loadBrandImages(rows.map((row) => row.id));
  return mapBrandRows(rows, locale, images);
}

/** Cached active brands for the storefront brands page / filters. */
export async function listStorefrontBrands(
  locale: Locale,
): Promise<StorefrontBrandItem[]> {
  return unstable_cache(
    () => loadStorefrontBrands(locale),
    [`storefront-brands-${locale}`],
    {
      revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
      tags: [CACHE_TAGS.brands],
    },
  )();
}

/** Cached starred brands for the home partners strip (max 5). */
export async function listHomePartnerBrands(
  locale: Locale,
): Promise<StorefrontBrandItem[]> {
  return unstable_cache(
    () => loadHomePartnerBrands(locale),
    [`storefront-home-brands-${locale}`],
    {
      revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
      tags: [CACHE_TAGS.brands],
    },
  )();
}
