import "server-only";

import { and, asc, eq, isNotNull, isNull, or } from "drizzle-orm";

import { getDb } from "@/db/client";
import { brands, mediaAssets, type LocaleTranslation } from "@/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { mediaPublicUrl } from "@/lib/media/public-url";

export type AdminBrandListItem = {
  id: string;
  title: string;
  slug: string;
  status: string;
  sortOrder: number;
  imageUrl: string | null;
};

function translationFor(
  translations: (typeof brands.$inferSelect)["translations"],
  locale: Locale,
): LocaleTranslation | null {
  return translations[locale] ?? translations.hy ?? translations.en ?? null;
}

/** Lists non-deleted brands for the admin brands table. */
export async function listAdminBrands(
  locale: Locale,
): Promise<AdminBrandListItem[]> {
  const rows = await getDb()
    .select()
    .from(brands)
    .where(isNull(brands.deletedAt))
    .orderBy(asc(brands.sortOrder), asc(brands.createdAt));

  const byId = new Set(rows.map((row) => row.id));
  const images = new Map<string, string>();

  if (rows.length > 0) {
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

    for (const media of mediaRows) {
      if (!media.brandId || images.has(media.brandId)) continue;
      if (!byId.has(media.brandId)) continue;
      images.set(media.brandId, mediaPublicUrl(media.objectKey));
    }
  }

  return rows.map((row) => {
    const translation = translationFor(row.translations, locale);
    return {
      id: row.id,
      title: translation?.title ?? "Untitled",
      slug: translation?.slug ?? "",
      status: row.status,
      sortOrder: row.sortOrder,
      imageUrl: images.get(row.id) ?? null,
    };
  });
}
