/** Store branch as authored in the locale contact dictionaries. */
export type StoreBranch = {
  address: string;
  /** District label, `null` when the address already identifies the area. */
  district: string | null;
  /** Local display phone, `null` when the branch has no dedicated line. */
  phone: string | null;
};

/** Formats a branch address as `Street 1 (District)` for contact and footer lists. */
export function formatBranchAddress(branch: StoreBranch): string {
  return branch.district
    ? `${branch.address} (${branch.district})`
    : branch.address;
}
