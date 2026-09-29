import { convertAmount } from "@/lib/money/convert";
import type { Currency } from "@/lib/money/currency";
import { defaultCurrency } from "@/lib/money/currency";
import { getCurrencyMeta } from "@/lib/money/currency-meta";
import { formatMoneyAmount } from "@/lib/money/format";

/** Fallback ceiling when the catalog has no active products. */
export const CATALOG_PRICE_SLIDER_FALLBACK_MAX_AMD = 400_000;

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

function ceilToStep(value: number, step: number): number {
  if (step <= 1) return Math.max(1, Math.ceil(value));
  return Math.max(step, Math.ceil(value / step) * step);
}

/**
 * Builds display-currency bounds for the catalog dual price slider.
 * `maxAmd` should be the highest active product list price in AMD.
 */
export function buildCatalogPriceSliderBounds(input: {
  currency: Currency;
  rate: string;
  locale: string;
  maxAmd?: number;
}): CatalogPriceSliderBounds {
  const step = sliderStepForCurrency(input.currency);
  const maxAmd =
    input.maxAmd != null && input.maxAmd > 0
      ? Math.floor(input.maxAmd)
      : CATALOG_PRICE_SLIDER_FALLBACK_MAX_AMD;

  const max = ceilToStep(
    Math.max(
      1,
      Math.round(amdToDisplayMajor(maxAmd, input.currency, input.rate)),
    ),
    step,
  );

  return {
    min: 0,
    max,
    step,
    minLabel: formatAmdAsDisplay(0, input.currency, input.rate, input.locale),
    maxLabel: formatCatalogSliderPrice(max, input.currency, input.locale),
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
  return formatMoneyAmount(minor, currency, locale);
}
