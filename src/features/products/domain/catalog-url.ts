import {
  DEFAULT_CATALOG_PAGE_SIZE,
  type CatalogListFilter,
} from "@/features/products/schemas/catalog-list";

/** Catalog query keys that Clear Filters may remove (locale path stays). */
export const CATALOG_FILTER_PARAM_KEYS = [
  "q",
  "minPrice",
  "maxPrice",
  "category",
  "inStock",
  "sort",
  "page",
  "pageSize",
] as const;

/**
 * Builds a shareable catalog query string from normalized filters.
 * Omits default sort/page/pageSize so URLs stay short.
 */
export function buildCatalogQuery(
  filters: CatalogListFilter,
  overrides: Partial<CatalogListFilter> = {},
): string {
  const merged: CatalogListFilter = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (merged.q) params.set("q", merged.q);
  if (merged.minPrice != null) params.set("minPrice", String(merged.minPrice));
  if (merged.maxPrice != null) params.set("maxPrice", String(merged.maxPrice));
  if (merged.category) params.set("category", merged.category);
  if (merged.inStock === true) params.set("inStock", "true");
  if (merged.inStock === false) params.set("inStock", "false");
  if (merged.sort !== "newest") params.set("sort", merged.sort);
  if (merged.page > 1) params.set("page", String(merged.page));
  if (merged.pageSize !== DEFAULT_CATALOG_PAGE_SIZE) {
    params.set("pageSize", String(merged.pageSize));
  }

  return params.toString();
}

/** Catalog list href under a locale, with optional filter overrides. */
export function catalogHref(
  locale: string,
  filters: CatalogListFilter,
  overrides: Partial<CatalogListFilter> = {},
): string {
  const query = buildCatalogQuery(filters, overrides);
  return query ? `/${locale}/products?${query}` : `/${locale}/products`;
}
