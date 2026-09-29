"use server";

import { eq, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDb } from "@/db/client";
import { deliveryRules } from "@/db/schema";
import { buildLocaleLabels } from "@/features/delivery/domain/country-translations";
import {
  deliveryLocationSchema,
  type DeliveryLocationInput,
} from "@/features/delivery/schemas";
import { requireAdmin } from "@/lib/auth/policies";
import { createId } from "@/lib/id";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { err, ok, type Result } from "@/lib/result";

function revalidateDelivery(locale: string): void {
  revalidatePath(`/${locale}/admin/delivery`);
  revalidatePath(`/${locale}/checkout`);
  revalidatePath(`/${locale}/cart`);
}

/**
 * Keeps a compact country code for address snapshots: 2-letter ISO when
 * provided, otherwise uses the English display name.
 */
function resolveCountryCode(countryEn: string): string {
  const trimmed = countryEn.trim();
  if (/^[a-z]{2}$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  return trimmed;
}

function toLocationValues(data: DeliveryLocationInput) {
  const countryTranslations = buildLocaleLabels({
    hy: data.countryHy,
    en: data.countryEn,
    ru: data.countryRu,
  });
  const cityTranslations = buildLocaleLabels({
    hy: data.cityHy,
    en: data.cityEn,
    ru: data.cityRu,
  });

  return {
    countryCode: resolveCountryCode(data.countryEn),
    countryTranslations,
    city: data.cityEn.trim(),
    cityTranslations,
    priceAmount: data.priceAmount,
    freeThresholdAmount: data.freeThresholdAmount,
  };
}

/** Creates a delivery location for checkout pricing. */
export async function createDeliveryLocationAction(
  locale: string,
  raw: DeliveryLocationInput,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  await requireAdmin(locale as Locale);

  const parsed = deliveryLocationSchema.safeParse(raw);
  if (!parsed.success) {
    return err("VALIDATION", "Invalid delivery location.");
  }

  const values = toLocationValues(parsed.data);
  const [maxPriority] = await getDb()
    .select({ value: max(deliveryRules.priority) })
    .from(deliveryRules);

  const id = createId();
  await getDb().insert(deliveryRules).values({
    id,
    ...values,
    isActive: true,
    priority: (maxPriority?.value ?? 0) + 1,
  });

  revalidateDelivery(locale);
  return ok({ id });
}

/** Updates an existing delivery location. */
export async function updateDeliveryLocationAction(
  locale: string,
  id: string,
  raw: DeliveryLocationInput,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  await requireAdmin(locale as Locale);

  const parsed = deliveryLocationSchema.safeParse(raw);
  if (!parsed.success) {
    return err("VALIDATION", "Invalid delivery location.");
  }

  const [existing] = await getDb()
    .select({ id: deliveryRules.id })
    .from(deliveryRules)
    .where(eq(deliveryRules.id, id))
    .limit(1);

  if (!existing) {
    return err("NOT_FOUND", "Delivery location not found.");
  }

  await getDb()
    .update(deliveryRules)
    .set({
      ...toLocationValues(parsed.data),
      updatedAt: new Date(),
    })
    .where(eq(deliveryRules.id, id));

  revalidateDelivery(locale);
  return ok({ id });
}

/** Soft-deactivates a delivery location (keeps order history references). */
export async function deleteDeliveryLocationAction(
  locale: string,
  id: string,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  await requireAdmin(locale as Locale);

  const [existing] = await getDb()
    .select({ id: deliveryRules.id })
    .from(deliveryRules)
    .where(eq(deliveryRules.id, id))
    .limit(1);

  if (!existing) {
    return err("NOT_FOUND", "Delivery location not found.");
  }

  await getDb()
    .update(deliveryRules)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(eq(deliveryRules.id, id));

  revalidateDelivery(locale);
  return ok({ id });
}
