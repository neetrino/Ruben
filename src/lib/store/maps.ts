const MAP_ZOOM_LEVEL = 17;
const MAP_CITY = "Yerevan";

/**
 * Firm search label on Yandex Maps. "RUBEN" alone matches улица Рубена;
 * this query resolves the store network (see contact branches).
 */
const STORE_FIRM_MAP_QUERY = "Ruben строительный гипермаркет";

function encodeMapsText(text: string): string {
  return encodeURIComponent(text);
}

function storeBranchMapQuery(address: string): string {
  return `${address}, ${MAP_CITY}, ${STORE_FIRM_MAP_QUERY}`;
}

/** Yandex Maps embed for a store branch (contact page map). */
export function storeMapEmbedSrc(address: string): string {
  return `https://yandex.com/map-widget/v1/?text=${encodeMapsText(
    storeBranchMapQuery(address),
  )}&z=${MAP_ZOOM_LEVEL}`;
}

/** All Ruben firm locations on Yandex Maps (mobile header location icon). */
export function storeMapsFirmHref(): string {
  return `https://yandex.com/maps/?text=${encodeMapsText(
    `${STORE_FIRM_MAP_QUERY} ${MAP_CITY}`,
  )}`;
}

/**
 * Yandex Maps link for one Ruben branch (footer). Address comes first so Maps
 * opens the firm pin, not a street named Ruben.
 */
export function storeMapsSearchHref(
  _storeName: string,
  address: string,
): string {
  return `https://yandex.com/maps/?text=${encodeMapsText(
    storeBranchMapQuery(address),
  )}&z=${MAP_ZOOM_LEVEL}`;
}
