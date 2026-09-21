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

/** Keyless Google Maps embed for a store address (contact page map). */
export function storeMapEmbedSrc(address: string): string {
  return `https://www.google.com/maps?q=${encodeMapsText(
    `${address}, ${MAP_CITY}`,
  )}&z=${MAP_ZOOM_LEVEL}&hl=en&output=embed`;
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
    `${address}, ${MAP_CITY}, ${STORE_FIRM_MAP_QUERY}`,
  )}&z=${MAP_ZOOM_LEVEL}`;
}
