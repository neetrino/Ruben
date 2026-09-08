/** Main branch used for the shared map embed (contact page + footer). */
const PRIMARY_BRANCH_QUERY = "Adonts 19, Yerevan, Armenia";

/** Shared Google Maps embed for store location (contact + footer). */
export const STORE_MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  PRIMARY_BRANCH_QUERY,
)}&z=17&hl=en&output=embed`;
