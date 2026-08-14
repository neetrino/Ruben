import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import {
  getAdminDictionary,
  type AdminDictionary,
} from "@/lib/i18n/get-dictionary";

/** Resolves a route locale param to a known Locale (falls back to default). */
export function resolveAdminLocale(locale: string): Locale {
  return isLocale(locale) ? locale : defaultLocale;
}

/** Admin copy for a route locale param (sync; safe in client components). */
export function adminCopy(locale: string): AdminDictionary {
  return getAdminDictionary(resolveAdminLocale(locale));
}
