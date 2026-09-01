import { convertAmount } from "@/lib/money/convert";
import type { Currency } from "@/lib/money/currency";
import { currencySymbols, defaultCurrency } from "@/lib/money/currency";
import { getCurrencyMeta } from "@/lib/money/currency-meta";
import { formatMoneyAmount } from "@/lib/money/format";

/** Inclusive catalog price slider ceiling in AMD (Figma shop filter max). */
export const CATALOG_PRICE_SLIDER_MAX_AMD = 400_000;

export type CatalogPriceSliderBounds = {
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  currency: Currency;
};

function amdToDisplayMajor(
  amdAmount: number,
  currency: Currency,
  rate: string,
): number {
  const converted = convertAmount(
    amdAmount,
    rate,
    defaultCurrency,
    currency,
  );
  const scale = getCurrencyMeta(currency).scale;
  return Number(converted.amount) / 10 ** scale;
}

function formatAmdAsDisplay(
  amdAmount: number,
  currency: Currency,
  rate: string,
  locale: string,
): string {
  const converted = convertAmount(
    amdAmount,
    rate,
    defaultCurrency,
    currency,
  );
  return formatMoneyAmount(converted.amount, currency, locale);
}

function sliderStepForCurrency(currency: Currency): number {
  switch (currency) {
    case "USD":
      return 1;
    case "RUB":
      return 10;
    case "AMD":
    default:
      return 1_000;
  }
}

/**
 * Builds display-currency bounds for the catalog dual price slider.
 */
export function buildCatalogPriceSliderBounds(input: {
  currency: Currency;
  rate: string;
  locale: string;
}): CatalogPriceSliderBounds {
  const max = Math.max(
    1,
    Math.round(
      amdToDisplayMajor(
        CATALOG_PRICE_SLIDER_MAX_AMD,
        input.currency,
        input.rate,
      ),
    ),
  );
  const step = sliderStepForCurrency(input.currency);

  return {
    min: 0,
    max,
    step,
    minLabel: formatAmdAsDisplay(0, input.currency, input.rate, input.locale),
    maxLabel: formatAmdAsDisplay(
      CATALOG_PRICE_SLIDER_MAX_AMD,
      input.currency,
      input.rate,
      input.locale,
    ),
    currency: input.currency,
  };
}

/** Formats a display-major slider value for the sidebar readout. */
export function formatCatalogSliderPrice(
  majorUnits: number,
  currency: Currency,
  locale: string,
): string {
  const scale = getCurrencyMeta(currency).scale;
  const minor = Math.round(majorUnits * 10 ** scale);
  const withCode = formatMoneyAmount(minor, currency, locale);
  return withCode.replace(` ${currency}`, ` ${currencySymbols[currency]}`);
}
