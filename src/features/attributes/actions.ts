"use server";

import { and, eq, isNull, max } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db/client";
import { productAttributeValues, productAttributes } from "@/db/schema";
import { mergeLocaleTranslation } from "@/features/attributes/application/merge-locale-translation";
import {
  persistAttributeImage,
  removeAttributeImage,
} from "@/features/attributes/application/persist-attribute-media";
import { revalidateAttributes } from "@/features/attributes/application/revalidate-attributes";
import { slugifyAttributeCode } from "@/features/attributes/domain/normalize-attribute";
import { requireAdmin } from "@/lib/auth/policies";
import { createId } from "@/lib/id";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { err, ok, type Result } from "@/lib/result";

const attributeTypeSchema = z.enum(["TEXT", "COLOR"]);

const attributeFormSchema = z.object({
  title: z.string().trim().min(1).max(120),
  code: z.string().trim().min(1).max(120),
  type: attributeTypeSchema,
  isFilterable: z.boolean(),
  status: z.enum(["ACTIVE", "ARCHIVED"]),
});

function parseFilterable(raw: FormDataEntryValue | null): boolean {
  return raw === "1" || raw === "true" || raw === "on";
}

function parseAttributeForm(formData: FormData) {
  return attributeFormSchema.safeParse({
    title: formData.get("title"),
    code:
      formData.get("code") ||
      slugifyAttributeCode(String(formData.get("title") ?? "")),
    type: formData.get("type"),
    isFilterable: parseFilterable(formData.get("isFilterable")),
    status: formData.get("status") ?? "ACTIVE",
  });
}

/** Creates a global product attribute from the admin drawer. */
export async function createAttributeFromDrawerAction(
  locale: string,
  formData: FormData,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = parseAttributeForm(formData);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Invalid attribute payload.");
  }

  await requireAdmin(locale as Locale);

  const code = slugifyAttributeCode(parsed.data.code);
  const [duplicate] = await getDb()
    .select({ id: productAttributes.id })
    .from(productAttributes)
    .where(
      and(eq(productAttributes.code, code), isNull(productAttributes.deletedAt)),
    )
    .limit(1);

  if (duplicate) {
    return err("VALIDATION_ERROR", "An attribute with this code already exists.");
  }

  const [maxSort] = await getDb()
    .select({ value: max(productAttributes.sortOrder) })
    .from(productAttributes)
    .where(isNull(productAttributes.deletedAt));

  const id = createId();
  await getDb().insert(productAttributes).values({
    id,
    code,
    translations: mergeLocaleTranslation(
      null,
      locale as Locale,
      parsed.data.title,
      code,
    ),
    type: parsed.data.type,
    isFilterable: parsed.data.isFilterable,
    sortOrder: (maxSort?.value ?? 0) + 1,
    status: parsed.data.status,
  });

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    const mediaResult = await persistAttributeImage(id, image);
    if (mediaResult.error) {
      return err("VALIDATION_ERROR", mediaResult.error);
    }
  }

  revalidateAttributes(locale);
  return ok({ id });
}

/** Updates a global product attribute from the admin drawer. */
export async function updateAttributeFromDrawerAction(
  locale: string,
  attributeId: string,
  formData: FormData,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = parseAttributeForm(formData);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Invalid attribute payload.");
  }

  await requireAdmin(locale as Locale);

  const [existing] = await getDb()
    .select({
      id: productAttributes.id,
      translations: productAttributes.translations,
      type: productAttributes.type,
    })
    .from(productAttributes)
    .where(
      and(eq(productAttributes.id, attributeId), isNull(productAttributes.deletedAt)),
    )
    .limit(1);

  if (!existing) {
    return err("NOT_FOUND", "Attribute not found.");
  }

  const code = slugifyAttributeCode(parsed.data.code);
  const [duplicate] = await getDb()
    .select({ id: productAttributes.id })
    .from(productAttributes)
    .where(
      and(eq(productAttributes.code, code), isNull(productAttributes.deletedAt)),
    )
    .limit(1);

  if (duplicate && duplicate.id !== existing.id) {
    return err("VALIDATION_ERROR", "An attribute with this code already exists.");
  }

  if (parsed.data.type !== existing.type) {
    const [value] = await getDb()
      .select({ id: productAttributeValues.id })
      .from(productAttributeValues)
      .where(
        and(
          eq(productAttributeValues.attributeId, existing.id),
          isNull(productAttributeValues.deletedAt),
        ),
      )
      .limit(1);
    if (value) {
      return err(
        "VALIDATION_ERROR",
        "Remove all values before changing the attribute type.",
      );
    }
  }

  await getDb()
    .update(productAttributes)
    .set({
      code,
      translations: mergeLocaleTranslation(
        existing.translations,
        locale as Locale,
        parsed.data.title,
        code,
      ),
      type: parsed.data.type,
      isFilterable: parsed.data.isFilterable,
      status: parsed.data.status,
      updatedAt: new Date(),
    })
    .where(eq(productAttributes.id, existing.id));

  const image = formData.get("image");
  const removeImage = formData.get("removeImage") === "1";
  if (image instanceof File && image.size > 0) {
    const mediaResult = await persistAttributeImage(existing.id, image);
    if (mediaResult.error) {
      return err("VALIDATION_ERROR", mediaResult.error);
    }
  } else if (removeImage) {
    await removeAttributeImage(existing.id);
  }

  revalidateAttributes(locale);
  return ok({ id: existing.id });
}

/** Soft-deletes an attribute and its values. */
export async function deleteAttributeAction(
  locale: string,
  attributeId: string,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  await requireAdmin(locale as Locale);
  const now = new Date();

  const [updated] = await getDb()
    .update(productAttributes)
    .set({ deletedAt: now, status: "ARCHIVED", updatedAt: now })
    .where(
      and(eq(productAttributes.id, attributeId), isNull(productAttributes.deletedAt)),
    )
    .returning({ id: productAttributes.id });

  if (!updated) {
    return err("NOT_FOUND", "Attribute not found.");
  }

  await getDb()
    .update(productAttributeValues)
    .set({ deletedAt: now, updatedAt: now })
    .where(
      and(
        eq(productAttributeValues.attributeId, updated.id),
        isNull(productAttributeValues.deletedAt),
      ),
    );

  revalidateAttributes(locale);
  return ok({ id: updated.id });
}
