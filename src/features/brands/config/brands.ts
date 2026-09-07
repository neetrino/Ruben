/**
 * Storefront partner brands (v1 — static; no brands CMS / logo assets yet).
 * Names render as bold wordmark logos (same approach as home partners strip).
 */
export const STOREFRONT_BRANDS = [
  { id: "makita", name: "Makita" },
  { id: "bosch", name: "Bosch" },
  { id: "dewalt", name: "DeWalt" },
  { id: "milwaukee", name: "Milwaukee" },
  { id: "hitachi", name: "Hitachi" },
] as const;

export type StorefrontBrand = (typeof STOREFRONT_BRANDS)[number];
