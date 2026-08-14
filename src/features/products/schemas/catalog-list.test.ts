import { describe, expect, it } from "vitest";

import { buildCatalogQuery } from "@/features/products/domain/catalog-url";
import {
  catalogListFilterSchema,
  DEFAULT_CATALOG_FILTERS,
} from "@/features/products/schemas/catalog-list";

describe("catalogListFilterSchema", () => {
  it("applies safe defaults", () => {
    expect(catalogListFilterSchema.parse({})).toEqual(DEFAULT_CATALOG_FILTERS);
  });

  it("parses sort, price, category, and stock filters", () => {
    expect(
      catalogListFilterSchema.parse({
        q: "  earbuds ",
        minPrice: "1000",
        maxPrice: "5000",
        category: "electronics",
        inStock: "true",
        sort: "price_asc",
        page: "2",
        pageSize: "12",
      }),
    ).toEqual({
      q: "earbuds",
      minPrice: 1000,
      maxPrice: 5000,
      category: "electronics",
      inStock: true,
      sort: "price_asc",
      page: 2,
      pageSize: 12,
    });
  });

  it("rejects maxPrice below minPrice", () => {
    const result = catalogListFilterSchema.safeParse({
      minPrice: "5000",
      maxPrice: "1000",
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown sort and pageSize", () => {
    expect(catalogListFilterSchema.safeParse({ sort: "alpha" }).success).toBe(
      false,
    );
    expect(catalogListFilterSchema.safeParse({ pageSize: "15" }).success).toBe(
      false,
    );
  });
});

describe("buildCatalogQuery", () => {
  it("omits default sort/page/pageSize", () => {
    expect(buildCatalogQuery(DEFAULT_CATALOG_FILTERS)).toBe("");
  });

  it("includes active filters and resets page via overrides", () => {
    const query = buildCatalogQuery(
      {
        ...DEFAULT_CATALOG_FILTERS,
        q: "hub",
        sort: "popular",
        page: 3,
        pageSize: 48,
      },
      { page: 1 },
    );
    expect(query).toBe("q=hub&sort=popular&pageSize=48");
  });
});
