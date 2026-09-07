const TITLE_BASE_CLASS =
  "flex items-center font-black tracking-[0.7px] text-black uppercase";

/** Shared storefront page title canon (shop, wishlist, compare, checkout). */
export const STOREFRONT_PAGE_TITLE_CLASS = `${TITLE_BASE_CLASS} h-[42px] text-[28px] leading-none`;

/**
 * Same canon for titles whose single word is wider than a phone viewport
 * (e.g. Armenian "ՔԱՂԱՔԱԿԱՆՈՒԹՅՈՒՆՆԵՐ"): scales down and wraps instead of
 * bleeding past the page padding.
 */
export const STOREFRONT_PAGE_TITLE_FLUID_CLASS = `${TITLE_BASE_CLASS} min-h-[42px] text-[22px] leading-tight break-words sm:text-[28px]`;

/** Supporting line rendered under a storefront page title. */
export const STOREFRONT_PAGE_SUBTITLE_CLASS = "text-sm leading-5 text-[#888]";
