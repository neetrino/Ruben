/**
 * Static partner brands for the home page logo strip.
 * No brands CMS in v1 — names render as accessible text marks.
 */
export const HOME_PARTNER_BRANDS = [
  { id: "samsung", name: "Samsung" },
  { id: "apple", name: "Apple" },
  { id: "xiaomi", name: "Xiaomi" },
  { id: "sony", name: "Sony" },
  { id: "lg", name: "LG" },
  { id: "bosch", name: "Bosch" },
] as const;

export type HomePartnerBrand = (typeof HOME_PARTNER_BRANDS)[number];
