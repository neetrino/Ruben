export const locales = ["hy", "en", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "hy";

export const localeLabels: Record<Locale, string> = {
  hy: "Հայերեն",
  en: "English",
  ru: "Русский",
};

/** Compact caps labels for pills and segmented controls (ENG / ՀԱՅ / РУС). */
export const localeShortLabels: Record<Locale, string> = {
  hy: "ՀԱՅ",
  en: "ENG",
  ru: "РУС",
};

/** Swaps the locale segment of a localized pathname, keeping the rest intact. */
export function replaceLocaleInPath(
  pathname: string,
  nextLocale: Locale,
): string {
  const segments = pathname.split("/");
  if (segments.length > 1) {
    segments[1] = nextLocale;
    return segments.join("/") || `/${nextLocale}`;
  }

  return `/${nextLocale}`;
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
