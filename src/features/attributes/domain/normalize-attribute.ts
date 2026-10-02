const HEX_COLOR_PATTERN = /^#([0-9A-Fa-f]{6})$/;

/** Builds a stable attribute/value code from a display title. */
export function slugifyAttributeCode(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

  return slug || "attribute";
}

/** Normalizes a hex color to `#RRGGBB`, or null when invalid. */
export function normalizeSwatchHex(raw: string): string | null {
  const trimmed = raw.trim();
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  const match = HEX_COLOR_PATTERN.exec(withHash);
  if (!match?.[1]) {
    return null;
  }
  return `#${match[1].toUpperCase()}`;
}
