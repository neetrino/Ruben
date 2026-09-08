const MAP_ZOOM_LEVEL = 17;
const MAP_CITY = "Yerevan, Armenia";

/** Keyless Google Maps embed for a store address (contact page map). */
export function storeMapEmbedSrc(address: string): string {
  const query = encodeURIComponent(`${address}, ${MAP_CITY}`);

  return `https://www.google.com/maps?q=${query}&z=${MAP_ZOOM_LEVEL}&hl=en&output=embed`;
}
