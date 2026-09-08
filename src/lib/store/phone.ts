const ARMENIA_COUNTRY_CODE = "374";

/**
 * Builds a `tel:` href from a display phone number.
 * Local Armenian numbers (`055 10 20 09`) are expanded to `+37455102009`.
 */
export function toTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const national = digits.startsWith("0") ? digits.slice(1) : digits;
  const withCountryCode = national.startsWith(ARMENIA_COUNTRY_CODE)
    ? national
    : `${ARMENIA_COUNTRY_CODE}${national}`;

  return `tel:+${withCountryCode}`;
}
