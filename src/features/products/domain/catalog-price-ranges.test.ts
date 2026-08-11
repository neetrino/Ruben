import { describe, expect, it } from "vitest";

import {
  buildCatalogPriceSliderBounds,
  CATALOG_PRICE_SLIDER_MAX_AMD,
  formatCatalogSliderPrice,
} from "@/features/products/domain/catalog-price-ranges";

describe("buildCatalogPriceSliderBounds", () => {
  it("builds AMD slider bounds with thousand steps", () => {
    const bounds = buildCatalogPriceSliderBounds({
      currency: "AMD",
      rate: "1",
      locale: "en",
    });

    expect(bounds).toMatchObject({
      min: 0,
      max: CATALOG_PRICE_SLIDER_MAX_AMD,
      step: 1_000,
      currency: "AMD",
    });
    expect(bounds.maxLabel).toContain("100");
  });

  it("formats slider readout values", () => {
    expect(formatCatalogSliderPrice(12_000, "AMD", "en")).toContain("12");
  });
});
