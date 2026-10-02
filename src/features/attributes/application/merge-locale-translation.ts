import type { TranslationsJson } from "@/db/schema";
import type { Locale } from "@/lib/i18n/config";

/** Merges one locale title/slug into an existing translations JSON blob. */
export function mergeLocaleTranslation(
  existing: TranslationsJson | null | undefined,
  locale: Locale,
  title: string,
  slug: string,
): TranslationsJson {
  return {
    ...(existing ?? {}),
    [locale]: {
      ...(existing?.[locale] ?? {}),
      title,
      slug,
    },
  };
}
