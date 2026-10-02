import "server-only";

import { and, asc, eq, inArray, isNotNull, isNull, or } from "drizzle-orm";

import { getDb } from "@/db/client";
import {
  mediaAssets,
  productAttributeValues,
  productAttributes,
  type LocaleTranslation,
} from "@/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { mediaPublicUrl } from "@/lib/media/public-url";

export type AdminAttributeValueItem = {
  id: string;
  label: string;
  code: string;
  swatchHex: string | null;
  sortOrder: number;
};

export type AdminAttributeListItem = {
  id: string;
  title: string;
  code: string;
  type: "TEXT" | "COLOR";
  isFilterable: boolean;
  status: string;
  sortOrder: number;
  imageUrl: string | null;
  values: AdminAttributeValueItem[];
};

function translationFor(
  translations: (typeof productAttributes.$inferSelect)["translations"],
  locale: Locale,
): LocaleTranslation | null {
  return translations[locale] ?? translations.hy ?? translations.en ?? null;
}

/** Lists non-deleted product attributes with their values for admin CMS. */
export async function listAdminAttributes(
  locale: Locale,
): Promise<AdminAttributeListItem[]> {
  const rows = await getDb()
    .select()
    .from(productAttributes)
    .where(isNull(productAttributes.deletedAt))
    .orderBy(asc(productAttributes.sortOrder), asc(productAttributes.createdAt));

  if (rows.length === 0) {
    return [];
  }

  const attributeIds = rows.map((row) => row.id);
  const byId = new Set(attributeIds);

  const valueRows = await getDb()
    .select()
    .from(productAttributeValues)
    .where(
      and(
        isNull(productAttributeValues.deletedAt),
        inArray(productAttributeValues.attributeId, attributeIds),
      ),
    )
    .orderBy(
      asc(productAttributeValues.sortOrder),
      asc(productAttributeValues.createdAt),
    );

  const images = new Map<string, string>();
  const mediaRows = await getDb()
    .select({
      attributeId: mediaAssets.attributeId,
      objectKey: mediaAssets.objectKey,
    })
    .from(mediaAssets)
    .where(
      and(
        isNotNull(mediaAssets.attributeId),
        eq(mediaAssets.uploadStatus, "READY"),
        or(
          eq(mediaAssets.isPrimary, true),
          eq(mediaAssets.role, "PRIMARY"),
          eq(mediaAssets.role, "COVER"),
        ),
      ),
    );

  for (const media of mediaRows) {
    if (!media.attributeId || images.has(media.attributeId)) continue;
    if (!byId.has(media.attributeId)) continue;
    images.set(media.attributeId, mediaPublicUrl(media.objectKey));
  }

  const valuesByAttribute = new Map<string, AdminAttributeValueItem[]>();
  for (const value of valueRows) {
    const translation = translationFor(value.translations, locale);
    const bucket = valuesByAttribute.get(value.attributeId) ?? [];
    bucket.push({
      id: value.id,
      label: translation?.title ?? value.code,
      code: value.code,
      swatchHex: value.swatchHex,
      sortOrder: value.sortOrder,
    });
    valuesByAttribute.set(value.attributeId, bucket);
  }

  return rows.map((row) => {
    const translation = translationFor(row.translations, locale);
    return {
      id: row.id,
      title: translation?.title ?? "Untitled",
      code: row.code,
      type: row.type,
      isFilterable: row.isFilterable,
      status: row.status,
      sortOrder: row.sortOrder,
      imageUrl: images.get(row.id) ?? null,
      values: valuesByAttribute.get(row.id) ?? [],
    };
  });
}
