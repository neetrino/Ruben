/**
 * Static partner brands for the home page logo strip (Figma 118:1233).
 * No brands CMS in v1 — names render as accessible text marks ("LOGO" in mock).
 */
export const HOME_PARTNER_BRANDS = [
  { id: "logo-1", name: "LOGO" },
  { id: "logo-2", name: "LOGO" },
  { id: "logo-3", name: "LOGO" },
  { id: "logo-4", name: "LOGO" },
] as const;

export type HomePartnerBrand = (typeof HOME_PARTNER_BRANDS)[number];
