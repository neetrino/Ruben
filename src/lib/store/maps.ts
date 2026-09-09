const MAP_ZOOM_LEVEL = 17;
const MAP_CITY = "Yerevan, Armenia";

function mapQuery(address: string): string {
  return encodeURIComponent(`${address}, ${MAP_CITY}`);
}

/** Keyless Google Maps embed for a store address (contact page map). */
export function storeMapEmbedSrc(address: string): string {
  return `https://www.google.com/maps?q=${mapQuery(address)}&z=${MAP_ZOOM_LEVEL}&hl=en&output=embed`;
}

/**
 * Google Maps search link for a branch (footer, mobile chrome). The store name
 * is part of the query so Maps resolves the business, not just the street.
 */
export function storeMapsSearchHref(
  storeName: string,
  address: string,
): string {
  return `https://www.google.com/maps/search/?api=1&query=${mapQuery(
    `${storeName} ${address}`,
  )}`;
}
