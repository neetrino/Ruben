/** Cards rendered per home rail once the grid reaches its widest layout. */
const TABLET_VISIBLE_COUNT = 6;

/**
 * Hides trailing cards so every home rail row stays full at its grid width:
 * `mobileVisibleCount` on phones, 6 on 3-column tablets, all 8 from 4 columns up.
 */
export function homeGridItemClass(
  index: number,
  mobileVisibleCount: number,
): string | undefined {
  if (index < mobileVisibleCount) {
    return undefined;
  }

  return index < TABLET_VISIBLE_COUNT
    ? "hidden tablet:block"
    : "hidden tablet-lg:block";
}
