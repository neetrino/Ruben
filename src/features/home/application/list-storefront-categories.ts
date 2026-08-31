import "server-only";

import { and, asc, eq, isNotNull, isNull, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { getDb } from "@/db/client";
import { categories, mediaAssets } from "@/db/schema";
import {
  CACHE_TAGS,
  PUBLIC_CACHE_REVALIDATE_SECONDS,
} from "@/lib/cache/tags";
import type { Locale } from "@/lib/i18n/config";
import { mediaPublicUrl } from "@/lib/media/public-url";

export type StorefrontCategory = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
};

async function loadStorefrontCategories(
  locale: Locale,
): Promise<StorefrontCategory[]> {
  const rows = await getDb()
    .select({
      id: categories.id,
      translations: categories.translations,
      sortOrder: categories.sortOrder,
    })
    .from(categories)
    .where(and(eq(categories.status, "ACTIVE"), isNull(categories.deletedAt)))
    .orderBy(asc(categories.sortOrder), asc(categories.createdAt));

  const images = new Map<string, string>();
  if (rows.length > 0) {
    const mediaRows = await getDb()
      .select({
        categoryId: mediaAssets.categoryId,
        objectKey: mediaAssets.objectKey,
      })
      .from(mediaAssets)
      .where(
        and(
          isNotNull(mediaAssets.categoryId),
          eq(mediaAssets.uploadStatus, "READY"),
          or(
            eq(mediaAssets.isPrimary, true),
            eq(mediaAssets.role, "PRIMARY"),
            eq(mediaAssets.role, "COVER"),
          ),
        ),
      );

    for (const media of mediaRows) {
      if (!media.categoryId || images.has(media.categoryId)) continue;
      images.set(media.categoryId, mediaPublicUrl(media.objectKey));
    }
  }

  return rows
    .map((row) => {
      const translation = row.translations[locale] ?? row.translations.hy;
      if (!translation) return null;
      return {
        id: row.id,
        title: translation.title,
        slug: translation.slug,
        imageUrl: images.get(row.id) ?? null,
      } satisfies StorefrontCategory;
    })
    .filter((row): row is StorefrontCategory => row !== null);
}

/** Active categories for the home categories carousel. */
export async function listStorefrontCategories(
  locale: Locale,
): Promise<StorefrontCategory[]> {
  return unstable_cache(
    async () => loadStorefrontCategories(locale),
    ["storefront-categories", locale],
    {
      tags: [CACHE_TAGS.products],
      revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
    },
  )();
}
