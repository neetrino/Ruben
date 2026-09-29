import type { DeliveryLocaleLabelsJson } from "@/db/schema";
import { defaultLocale, type Locale } from "@/lib/i18n/config";

/** Picks the best available label for a locale. */
export function resolveDeliveryLocaleLabel(
  translations: DeliveryLocaleLabelsJson | null | undefined,
  locale: Locale,
  fallback = "",
): string {
  const fromLocale = translations?.[locale]?.trim();
  if (fromLocale) return fromLocale;

  const fromDefault = translations?.[defaultLocale]?.trim();
  if (fromDefault) return fromDefault;

  for (const value of Object.values(translations ?? {})) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }

  return fallback.trim();
}

/** @deprecated Use resolveDeliveryLocaleLabel */
export const resolveDeliveryCountry = resolveDeliveryLocaleLabel;

/** Builds a complete translations object from three required labels. */
export function buildLocaleLabels(input: {
  hy: string;
  en: string;
  ru: string;
}): DeliveryLocaleLabelsJson {
  return {
    hy: input.hy.trim(),
    en: input.en.trim(),
    ru: input.ru.trim(),
  };
}

/** @deprecated Use buildLocaleLabels */
export const buildCountryTranslations = buildLocaleLabels;
