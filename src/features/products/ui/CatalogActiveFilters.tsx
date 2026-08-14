import { AppLink } from "@/components/ui/AppLink";
import { catalogHref } from "@/features/products/domain/catalog-url";
import type { CatalogListFilter } from "@/features/products/schemas/catalog-list";

type Chip = {
  key: string;
  label: string;
  href: string;
};

type CatalogActiveFiltersProps = {
  locale: string;
  filters: CatalogListFilter;
  categoryTitle: string | null;
  currencyCode: string;
  removeFilterLabel: string;
  labels: {
    search: string;
    minPrice: string;
    maxPrice: string;
    category: string;
    inStock: string;
    outOfStock: string;
  };
};

export function CatalogActiveFilters({
  locale,
  filters,
  categoryTitle,
  currencyCode,
  removeFilterLabel,
  labels,
}: CatalogActiveFiltersProps) {
  const chips: Chip[] = [];

  if (filters.q) {
    chips.push({
      key: "q",
      label: `${labels.search}: ${filters.q}`,
      href: catalogHref(locale, filters, { q: undefined, page: 1 }),
    });
  }
  if (filters.minPrice != null) {
    chips.push({
      key: "minPrice",
      label: `${labels.minPrice}: ${filters.minPrice} ${currencyCode}`,
      href: catalogHref(locale, filters, { minPrice: undefined, page: 1 }),
    });
  }
  if (filters.maxPrice != null) {
    chips.push({
      key: "maxPrice",
      label: `${labels.maxPrice}: ${filters.maxPrice} ${currencyCode}`,
      href: catalogHref(locale, filters, { maxPrice: undefined, page: 1 }),
    });
  }
  if (filters.category) {
    chips.push({
      key: "category",
      label: `${labels.category}: ${categoryTitle ?? filters.category}`,
      href: catalogHref(locale, filters, { category: undefined, page: 1 }),
    });
  }
  if (filters.inStock === true) {
    chips.push({
      key: "inStock",
      label: labels.inStock,
      href: catalogHref(locale, filters, { inStock: undefined, page: 1 }),
    });
  } else if (filters.inStock === false) {
    chips.push({
      key: "outOfStock",
      label: labels.outOfStock,
      href: catalogHref(locale, filters, { inStock: undefined, page: 1 }),
    });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-2" aria-label={removeFilterLabel}>
      {chips.map((chip) => (
        <li key={chip.key}>
          <AppLink
            href={chip.href}
            prefetchPolicy="intent"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 hover:border-gray-300 hover:bg-gray-50"
          >
            <span>{chip.label}</span>
            <span aria-hidden="true" className="text-gray-400">
              ×
            </span>
            <span className="sr-only">{removeFilterLabel}</span>
          </AppLink>
        </li>
      ))}
    </ul>
  );
}
