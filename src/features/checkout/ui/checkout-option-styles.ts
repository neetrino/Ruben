/** Shared checkout option card styles (MaMarie pattern, Ruben brand yellow). */
export const CHECKOUT_OPTION_BASE_CLASS =
  "flex cursor-pointer items-center rounded-[15px] border-2 p-4 transition-all";

export const CHECKOUT_OPTION_SELECTED_CLASS =
  "border-[var(--brand)] bg-[color-mix(in_srgb,var(--brand)_14%,white)]";

export const CHECKOUT_OPTION_DEFAULT_CLASS =
  "border-gray-200 hover:bg-gray-50/80";

export function checkoutOptionClass(isSelected: boolean): string {
  return `${CHECKOUT_OPTION_BASE_CLASS} ${
    isSelected ? CHECKOUT_OPTION_SELECTED_CLASS : CHECKOUT_OPTION_DEFAULT_CLASS
  }`;
}
