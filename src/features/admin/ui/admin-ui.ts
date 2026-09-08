/** Shared admin visual tokens (Kamancha layout, Ruben brand). */

export const ADMIN_CARD_RADIUS_CLASS = "rounded-[15px]";

export const ADMIN_CARD_CLASS =
  "rounded-[15px] bg-white ring-1 ring-gray-100/80";

export const ADMIN_CARD_PADDED_CLASS = `${ADMIN_CARD_CLASS} p-6`;

/** Hover lift used on dashboard / analytics cards. */
export const ADMIN_CARD_HOVER_CLASS =
  "transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/** Soft brand chips for dashboard / quick actions. */
export const ADMIN_CHIP_BRAND = {
  bg: "bg-[color-mix(in_srgb,var(--brand)_22%,white)]",
  fg: "text-black",
} as const;

export const ADMIN_CHIP_MINT = {
  bg: "bg-emerald-50",
  fg: "text-emerald-800",
} as const;

export const ADMIN_CHIP_CREAM = {
  bg: "bg-stone-100",
  fg: "text-stone-800",
} as const;

export const ADMIN_CHIP_SURFACE = {
  bg: "bg-gray-100",
  fg: "text-gray-700",
} as const;
