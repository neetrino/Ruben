import { describe, expect, it } from "vitest";

import {
  buildCatalogPriceSliderBounds,
  CATALOG_PRICE_SLIDER_FALLBACK_MAX_AMD,
  formatCatalogSliderPrice,
} from "@/features/products/domain/catalog-price-ranges";

describe("buildCatalogPriceSliderBounds", () => {
  it("uses the catalog max list price when provided", () => {
    const bounds = buildCatalogPriceSliderBounds({
      currency: "AMD",
      rate: "1",
      locale: "en",
      maxAmd: 450_000,
    });

    expect(bounds).toMatchObject({
      min: 0,
      max: 450_000,
      step: 1_000,
      currency: "AMD",
    });
    expect(bounds.maxLabel).toContain("450");
  });

  it("falls back when maxAmd is missing or zero", () => {
    const bounds = buildCatalogPriceSliderBounds({
      currency: "AMD",
      rate: "1",
      locale: "en",
      maxAmd: 0,
    });

    expect(bounds.max).toBe(CATALOG_PRICE_SLIDER_FALLBACK_MAX_AMD);
  });

  it("rounds the display max up to the currency step", () => {
    const bounds = buildCatalogPriceSliderBounds({
      currency: "AMD",
      rate: "1",
      locale: "en",
      maxAmd: 450_100,
    });

    expect(bounds.max).toBe(451_000);
  });

  it("formats slider readout values", () => {
    expect(formatCatalogSliderPrice(12_000, "AMD", "en")).toBe("12\u202f000\u00A0֏");
    expect(formatCatalogSliderPrice(26, "USD", "en")).toBe("26.00\u00A0$");
  });
});
