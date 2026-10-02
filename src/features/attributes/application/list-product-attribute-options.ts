import "server-only";

import { and, asc, eq, isNull } from "drizzle-orm";

import { getDb } from "@/db/client";
import {
  productAttributeAssignments,
  productAttributeValues,
  productAttributes,
  products,
  type LocaleTranslation,
} from "@/db/schema";
import type { Locale } from "@/lib/i18n/config";

export type ProductAttributeValueOption = {
  id: string;
  label: string;
  code: string;
  swatchHex: string | null;
};

export type ProductAttributeOptionGroup = {
  id: string;
  title: string;
  code: string;
  type: "TEXT" | "COLOR";
  values: ProductAttributeValueOption[];
};

export type CatalogFeatureOption = {
  id: string;
  label: string;
  swatchHex: string | null;
};

function translationFor(
  translations: (typeof productAttributes.$inferSelect)["translations"],
  locale: Locale,
): LocaleTranslation | null {
  return translations[locale] ?? translations.hy ?? translations.en ?? null;
}

/** Active attributes with values for the admin product drawer checkboxes. */
export async function listProductAttributeOptionGroups(
  locale: Locale,
): Promise<ProductAttributeOptionGroup[]> {
  const attributes = await getDb()
    .select()
    .from(productAttributes)
    .where(
      and(
        eq(productAttributes.status, "ACTIVE"),
        isNull(productAttributes.deletedAt),
      ),
    )
    .orderBy(asc(productAttributes.sortOrder), asc(productAttributes.createdAt));

  if (attributes.length === 0) {
    return [];
  }

  const values = await getDb()
    .select()
    .from(productAttributeValues)
    .where(isNull(productAttributeValues.deletedAt))
    .orderBy(
      asc(productAttributeValues.sortOrder),
      asc(productAttributeValues.createdAt),
    );

  const valuesByAttribute = new Map<string, ProductAttributeValueOption[]>();
  for (const value of values) {
    const translation = translationFor(value.translations, locale);
    const bucket = valuesByAttribute.get(value.attributeId) ?? [];
    bucket.push({
      id: value.id,
      label: translation?.title ?? value.code,
      code: value.code,
      swatchHex: value.swatchHex,
    });
    valuesByAttribute.set(value.attributeId, bucket);
  }

  return attributes
    .map((attribute) => {
      const translation = translationFor(attribute.translations, locale);
      const groupValues = valuesByAttribute.get(attribute.id) ?? [];
      if (groupValues.length === 0) return null;
      return {
        id: attribute.id,
        title: translation?.title ?? attribute.code,
        code: attribute.code,
        type: attribute.type,
        values: groupValues,
      } satisfies ProductAttributeOptionGroup;
    })
    .filter((group): group is ProductAttributeOptionGroup => group != null);
}

/**
 * Flat filterable attribute values for the storefront Features sidebar.
 * Only values actually assigned to at least one active product.
 */
export async function listCatalogFeatureOptions(
  locale: Locale,
): Promise<CatalogFeatureOption[]> {
  const rows = await getDb()
    .select({
      id: productAttributeValues.id,
      translations: productAttributeValues.translations,
      swatchHex: productAttributeValues.swatchHex,
      code: productAttributeValues.code,
      sortOrder: productAttributeValues.sortOrder,
      attributeSortOrder: productAttributes.sortOrder,
    })
    .from(productAttributeAssignments)
    .innerJoin(
      productAttributeValues,
      eq(
        productAttributeValues.id,
        productAttributeAssignments.attributeValueId,
      ),
    )
    .innerJoin(
      productAttributes,
      eq(productAttributes.id, productAttributeValues.attributeId),
    )
    .innerJoin(
      products,
      eq(products.id, productAttributeAssignments.productId),
    )
    .where(
      and(
        eq(products.status, "ACTIVE"),
        isNull(products.deletedAt),
        eq(productAttributes.status, "ACTIVE"),
        eq(productAttributes.isFilterable, true),
        isNull(productAttributes.deletedAt),
        isNull(productAttributeValues.deletedAt),
      ),
    )
    .orderBy(
      asc(productAttributes.sortOrder),
      asc(productAttributeValues.sortOrder),
    );

  const seen = new Set<string>();
  const options: CatalogFeatureOption[] = [];

  for (const row of rows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    const translation = translationFor(row.translations, locale);
    options.push({
      id: row.id,
      label: translation?.title ?? row.code,
      swatchHex: row.swatchHex,
    });
  }

  return options;
}
