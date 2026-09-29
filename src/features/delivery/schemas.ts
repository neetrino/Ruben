import { z } from "zod";

const labelSchema = z.string().trim().min(1).max(80);

export const deliveryLocationSchema = z.object({
  countryHy: labelSchema,
  countryEn: labelSchema,
  countryRu: labelSchema,
  cityHy: labelSchema,
  cityEn: labelSchema,
  cityRu: labelSchema,
  priceAmount: z.coerce.number().int().min(0).max(10_000_000),
  freeThresholdAmount: z.preprocess((value) => {
    if (value === "" || value == null) return null;
    return value;
  }, z.coerce.number().int().min(0).max(100_000_000).nullable()),
});

export type DeliveryLocationInput = z.infer<typeof deliveryLocationSchema>;
