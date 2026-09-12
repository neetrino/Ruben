"use server";

import { and, eq, inArray, isNull, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getDb } from "@/db/client";
import { brands, type TranslationsJson } from "@/db/schema";
import {
  persistBrandImage,
  removeBrandImage,
} from "@/features/brands/application/persist-brand-media";
import { requireAdmin } from "@/lib/auth/policies";
import { invalidateBrandsCache } from "@/lib/cache/invalidate-public";
import { createId } from "@/lib/id";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { err, ok, type Result } from "@/lib/result";

const createBrandSchema = z.object({
  title: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(120),
  status: z.enum(["ACTIVE", "ARCHIVED"]),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;

function buildTranslations(title: string, slug: string): TranslationsJson {
  const translation = { title, slug };
  return { hy: translation, en: translation, ru: translation };
}

function revalidateBrands(locale: string): void {
  revalidatePath(`/${locale}/admin/brands`);
  revalidatePath(`/${locale}/brands`);
  invalidateBrandsCache();
}

async function insertBrand(
  locale: Locale,
  data: CreateBrandInput,
): Promise<Result<{ id: string }>> {
  const [maxSort] = await getDb()
    .select({ value: max(brands.sortOrder) })
    .from(brands)
    .where(isNull(brands.deletedAt));

  const id = createId();
  await getDb().insert(brands).values({
    id,
    translations: buildTranslations(data.title, data.slug),
    sortOrder: (maxSort?.value ?? 0) + 1,
    status: data.status,
  });

  revalidateBrands(locale);
  return ok({ id });
}

/** Creates a brand from the admin drawer (fields + optional logo). */
export async function createBrandFromDrawerAction(
  locale: string,
  formData: FormData,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = createBrandSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Invalid brand payload.");
  }

  await requireAdmin(locale as Locale);
  const created = await insertBrand(locale, parsed.data);

  if (!created.ok) {
    return created;
  }

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    const mediaResult = await persistBrandImage(created.value.id, image);
    if (mediaResult.error) {
      return err("VALIDATION_ERROR", mediaResult.error);
    }
    revalidateBrands(locale);
  }

  return created;
}

/** Updates a brand from the admin drawer (fields + optional logo). */
export async function updateBrandFromDrawerAction(
  locale: string,
  brandId: string,
  formData: FormData,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = createBrandSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Invalid brand payload.");
  }

  await requireAdmin(locale as Locale);

  const [existing] = await getDb()
    .select({ id: brands.id })
    .from(brands)
    .where(and(eq(brands.id, brandId), isNull(brands.deletedAt)))
    .limit(1);

  if (!existing) {
    return err("NOT_FOUND", "Brand not found.");
  }

  await getDb()
    .update(brands)
    .set({
      translations: buildTranslations(parsed.data.title, parsed.data.slug),
      status: parsed.data.status,
      updatedAt: new Date(),
    })
    .where(eq(brands.id, existing.id));

  const image = formData.get("image");
  const removeImage = formData.get("removeImage") === "1";

  if (image instanceof File && image.size > 0) {
    const mediaResult = await persistBrandImage(existing.id, image);
    if (mediaResult.error) {
      return err("VALIDATION_ERROR", mediaResult.error);
    }
  } else if (removeImage) {
    await removeBrandImage(existing.id);
  }

  revalidateBrands(locale);
  return ok({ id: existing.id });
}

/** Soft-deletes a brand. */
export async function deleteBrandAction(
  locale: string,
  brandId: string,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  await requireAdmin(locale as Locale);

  const [updated] = await getDb()
    .update(brands)
    .set({
      deletedAt: new Date(),
      status: "ARCHIVED",
      updatedAt: new Date(),
    })
    .where(and(eq(brands.id, brandId), isNull(brands.deletedAt)))
    .returning({ id: brands.id });

  if (!updated) {
    return err("NOT_FOUND", "Brand not found.");
  }

  revalidateBrands(locale);
  return ok({ id: updated.id });
}

const reorderBrandsSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1),
});

/** Persists brand order via sortOrder (1-based). */
export async function reorderBrandsAction(
  locale: string,
  raw: z.infer<typeof reorderBrandsSchema>,
): Promise<Result<{ updated: number }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = reorderBrandsSchema.safeParse(raw);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Invalid brand order.");
  }

  await requireAdmin(locale as Locale);

  const uniqueIds = [...new Set(parsed.data.orderedIds)];
  if (uniqueIds.length !== parsed.data.orderedIds.length) {
    return err("VALIDATION_ERROR", "Duplicate brand ids in order.");
  }

  const rows = await getDb()
    .select({ id: brands.id })
    .from(brands)
    .where(and(isNull(brands.deletedAt), inArray(brands.id, uniqueIds)));

  if (rows.length !== uniqueIds.length) {
    return err("NOT_FOUND", "Brand not found.");
  }

  const all = await getDb()
    .select({ id: brands.id })
    .from(brands)
    .where(isNull(brands.deletedAt));

  if (all.length !== uniqueIds.length) {
    return err(
      "VALIDATION_ERROR",
      "Ordered ids must include every non-deleted brand.",
    );
  }

  const now = new Date();
  await Promise.all(
    uniqueIds.map((id, index) =>
      getDb()
        .update(brands)
        .set({ sortOrder: index + 1, updatedAt: now })
        .where(eq(brands.id, id)),
    ),
  );

  revalidateBrands(locale);
  return ok({ updated: uniqueIds.length });
}
