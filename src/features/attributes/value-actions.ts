"use server";

import { and, eq, isNull, max } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db/client";
import { productAttributeValues, productAttributes } from "@/db/schema";
import { mergeLocaleTranslation } from "@/features/attributes/application/merge-locale-translation";
import { revalidateAttributes } from "@/features/attributes/application/revalidate-attributes";
import {
  normalizeSwatchHex,
  slugifyAttributeCode,
} from "@/features/attributes/domain/normalize-attribute";
import { requireAdmin } from "@/lib/auth/policies";
import { createId } from "@/lib/id";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { err, ok, type Result } from "@/lib/result";

const addValueSchema = z.object({
  label: z.string().trim().min(1).max(120),
  swatchHex: z.string().trim().optional(),
});

/** Adds a value to an attribute (text label or color swatch). */
export async function addAttributeValueAction(
  locale: string,
  attributeId: string,
  raw: z.infer<typeof addValueSchema>,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = addValueSchema.safeParse(raw);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Invalid attribute value.");
  }

  await requireAdmin(locale as Locale);

  const [attribute] = await getDb()
    .select({
      id: productAttributes.id,
      type: productAttributes.type,
    })
    .from(productAttributes)
    .where(
      and(eq(productAttributes.id, attributeId), isNull(productAttributes.deletedAt)),
    )
    .limit(1);

  if (!attribute) {
    return err("NOT_FOUND", "Attribute not found.");
  }

  let code: string;
  let swatchHex: string | null = null;
  let label = parsed.data.label;

  if (attribute.type === "COLOR") {
    const hex = normalizeSwatchHex(parsed.data.swatchHex ?? parsed.data.label);
    if (!hex) {
      return err("VALIDATION_ERROR", "Enter a valid hex color (e.g. #FF0000).");
    }
    swatchHex = hex;
    code = hex.slice(1).toLowerCase();
    if (!label || normalizeSwatchHex(label)) {
      label = hex;
    }
  } else {
    code = slugifyAttributeCode(parsed.data.label);
  }

  const [duplicate] = await getDb()
    .select({ id: productAttributeValues.id })
    .from(productAttributeValues)
    .where(
      and(
        eq(productAttributeValues.attributeId, attribute.id),
        eq(productAttributeValues.code, code),
        isNull(productAttributeValues.deletedAt),
      ),
    )
    .limit(1);

  if (duplicate) {
    return err("VALIDATION_ERROR", "This value already exists.");
  }

  const [maxSort] = await getDb()
    .select({ value: max(productAttributeValues.sortOrder) })
    .from(productAttributeValues)
    .where(
      and(
        eq(productAttributeValues.attributeId, attribute.id),
        isNull(productAttributeValues.deletedAt),
      ),
    );

  const id = createId();
  await getDb().insert(productAttributeValues).values({
    id,
    attributeId: attribute.id,
    code,
    translations: mergeLocaleTranslation(null, locale as Locale, label, code),
    swatchHex,
    sortOrder: (maxSort?.value ?? 0) + 1,
  });

  revalidateAttributes(locale);
  return ok({ id });
}

/** Soft-deletes a single attribute value. */
export async function deleteAttributeValueAction(
  locale: string,
  valueId: string,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  await requireAdmin(locale as Locale);

  const [updated] = await getDb()
    .update(productAttributeValues)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(productAttributeValues.id, valueId),
        isNull(productAttributeValues.deletedAt),
      ),
    )
    .returning({ id: productAttributeValues.id });

  if (!updated) {
    return err("NOT_FOUND", "Attribute value not found.");
  }

  revalidateAttributes(locale);
  return ok({ id: updated.id });
}
