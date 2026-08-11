import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { deliveryRules } from "@/db/schema";
import { createId } from "@/lib/id";
import { logger } from "@/lib/observability/logger";

export type AdminDeliveryLocation = {
  id: string;
  country: string;
  city: string;
  priceAmount: number;
  freeThresholdAmount: number | null;
  priority: number;
};

export type CheckoutDeliveryOption = {
  id: string;
  country: string;
  city: string;
  priceAmount: number;
  freeThresholdAmount: number | null;
  label: string;
};

const DEFAULT_DELIVERY_CITY = "Yerevan";
const DEFAULT_DELIVERY_COUNTRY = "AM";
const DEFAULT_DELIVERY_PRICE = 1500;
const DEFAULT_FREE_THRESHOLD = 50000;

function locationLabel(country: string, city: string | null): string {
  const cityPart = city?.trim();
  if (cityPart) {
    return `${cityPart}, ${country}`;
  }
  return country;
}

function toCheckoutOption(row: {
  id: string;
  country: string;
  city: string | null;
  priceAmount: number;
  freeThresholdAmount: number | null;
}): CheckoutDeliveryOption {
  const city = row.city?.trim() || "";
  return {
    id: row.id,
    country: row.country,
    city,
    priceAmount: row.priceAmount,
    freeThresholdAmount: row.freeThresholdAmount,
    label: locationLabel(row.country, city || null),
  };
}

/** Lists all delivery locations for the admin table. */
export async function listAdminDeliveryLocations(): Promise<
  AdminDeliveryLocation[]
> {
  const rows = await getDb()
    .select({
      id: deliveryRules.id,
      country: deliveryRules.countryCode,
      city: deliveryRules.city,
      priceAmount: deliveryRules.priceAmount,
      freeThresholdAmount: deliveryRules.freeThresholdAmount,
      priority: deliveryRules.priority,
    })
    .from(deliveryRules)
    .where(eq(deliveryRules.isActive, true))
    .orderBy(desc(deliveryRules.priority), asc(deliveryRules.city));

  return rows.map((row) => ({
    id: row.id,
    country: row.country,
    city: row.city?.trim() || "",
    priceAmount: row.priceAmount,
    freeThresholdAmount: row.freeThresholdAmount,
    priority: row.priority,
  }));
}

/**
 * Ensures at least one active delivery location exists so checkout
 * delivery is never permanently blocked by an empty seed.
 */
async function ensureDefaultDeliveryLocation(): Promise<void> {
  const db = getDb();
  const [existing] = await db
    .select({ id: deliveryRules.id })
    .from(deliveryRules)
    .where(eq(deliveryRules.isActive, true))
    .limit(1);

  if (existing) {
    return;
  }

  await db.insert(deliveryRules).values({
    id: createId(),
    countryCode: DEFAULT_DELIVERY_COUNTRY,
    city: DEFAULT_DELIVERY_CITY,
    priceAmount: DEFAULT_DELIVERY_PRICE,
    freeThresholdAmount: DEFAULT_FREE_THRESHOLD,
    estimatedDaysMin: 1,
    estimatedDaysMax: 3,
    isActive: true,
    priority: 100,
  });

  logger.info("delivery.default_location_ensured", {
    city: DEFAULT_DELIVERY_CITY,
  });
}

/** Active delivery locations shown in the checkout location dropdown. */
export async function listCheckoutDeliveryOptions(): Promise<
  CheckoutDeliveryOption[]
> {
  await ensureDefaultDeliveryLocation();

  const rows = await getDb()
    .select({
      id: deliveryRules.id,
      country: deliveryRules.countryCode,
      city: deliveryRules.city,
      priceAmount: deliveryRules.priceAmount,
      freeThresholdAmount: deliveryRules.freeThresholdAmount,
    })
    .from(deliveryRules)
    .where(eq(deliveryRules.isActive, true))
    .orderBy(desc(deliveryRules.priority), asc(deliveryRules.city));

  return rows.map((row) => toCheckoutOption(row));
}
