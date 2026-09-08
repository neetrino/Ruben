/**
 * Static Brand / Features options for the Figma shop sidebar.
 * Product brand/attribute CMS is not in v1 — these drive UI parity only.
 */
export const CATALOG_BRAND_OPTIONS = [
  { id: "makita", label: "MAKITA", count: 5 },
  { id: "bosch", label: "BOSCH", count: 4 },
  { id: "dewalt", label: "DEWALT", count: 3 },
  { id: "milwaukee", label: "MILWAUKEE", count: 2 },
  { id: "hitachi", label: "HITACHI", count: 2 },
] as const;

export const CATALOG_FEATURE_OPTIONS = [
  { id: "18v", label: "18V Անլար" },
  { id: "brushless", label: "Brushless Motor" },
  { id: "heatgun", label: "Ֆենֆայեր" },
  { id: "led", label: "LED Լույս" },
  { id: "battery", label: "Li-Ion" },
  { id: "kit", label: "Հավաքածու" },
] as const;

export const CATALOG_BRAND_PREVIEW = 3;
export const CATALOG_FEATURE_PREVIEW = 4;
export const CATALOG_CATEGORY_PREVIEW = 6;
