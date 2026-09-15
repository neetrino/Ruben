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

/** Select options for checkout store pickup (label and value are the formatted address). */
export function pickupBranchOptions(
  branches: readonly StoreBranch[],
): Array<{ label: string; value: string }> {
  return branches.map((branch) => {
    const label = formatBranchAddress(branch);
    return { label, value: label };
  });
}

/** Whether `line1` matches a known pickup branch for the given locale list. */
export function isPickupBranchAddress(
  branches: readonly StoreBranch[],
  line1: string,
): boolean {
  const normalized = line1.trim();
  if (!normalized) {
    return false;
  }
  return branches.some((branch) => formatBranchAddress(branch) === normalized);
}
