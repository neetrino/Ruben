"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import type { CatalogCategoryOption } from "@/features/products/application/list-catalog-products";
import type { CatalogPriceSliderBounds } from "@/features/products/domain/catalog-price-ranges";
import { catalogHref } from "@/features/products/domain/catalog-url";
import type { CatalogListFilter } from "@/features/products/schemas/catalog-list";
import { CatalogPriceSlider } from "@/features/products/ui/CatalogPriceSlider";

type CatalogFiltersCopy = {
  searchLabel: string;
  searchPlaceholder: string;
  priceLabel: string;
  categoryLabel: string;
  allCategories: string;
  inStockLabel: string;
  inStockOnly: string;
  filtersTitle: string;
};

type CatalogFiltersProps = {
  locale: string;
  filters: CatalogListFilter;
  categories: CatalogCategoryOption[];
  priceBounds: CatalogPriceSliderBounds;
  copy: CatalogFiltersCopy;
};

const SEARCH_DEBOUNCE_MS = 350;

const LABEL = "text-xs font-medium tracking-wide text-gray-500 uppercase";

function optionClass(active: boolean): string {
  return [
    "flex w-full items-center rounded-md px-2.5 py-2 text-left text-sm transition-colors",
    active
      ? "bg-gray-900 font-medium text-white"
      : "text-gray-700 hover:bg-gray-100",
  ].join(" ");
}

export function CatalogFilters({
  locale,
  filters,
  categories,
  priceBounds,
  copy,
}: CatalogFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(filters.q ?? "");
  const [syncedQ, setSyncedQ] = useState(filters.q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (filters.q !== syncedQ) {
    setSyncedQ(filters.q);
    setSearchValue(filters.q ?? "");
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function navigate(overrides: Partial<CatalogListFilter>): void {
    const href = catalogHref(locale, filters, { ...overrides, page: 1 });
    startTransition(() => {
      router.push(href);
    });
  }

  function onSearchChange(value: string): void {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = value.trim();
      if (next === (filters.q ?? "")) return;
      navigate({ q: next.length > 0 ? next : undefined });
    }, SEARCH_DEBOUNCE_MS);
  }

  return (
    <aside
      className={`flex w-full flex-col gap-6 rounded-xl border border-gray-200 bg-gray-50/90 p-4 lg:sticky lg:top-24 lg:self-start ${
        isPending ? "opacity-70" : ""
      }`}
      aria-label={copy.filtersTitle}
    >
      <p className="text-sm font-semibold text-gray-900">{copy.filtersTitle}</p>

      <div>
        <label htmlFor="catalog-search" className={LABEL}>
          {copy.searchLabel}
        </label>
        <input
          id="catalog-search"
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={copy.searchPlaceholder}
          className="mt-2 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400"
        />
      </div>

      <fieldset className="space-y-1 border-0 p-0">
        <legend className={LABEL}>{copy.categoryLabel}</legend>
        <button
          type="button"
          className={optionClass(!filters.category)}
          aria-pressed={!filters.category}
          onClick={() => navigate({ category: undefined })}
        >
          {copy.allCategories}
        </button>
        {categories.map((category) => {
          const active = filters.category === category.slug;
          return (
            <button
              key={category.slug}
              type="button"
              className={optionClass(active)}
              aria-pressed={active}
              onClick={() => navigate({ category: category.slug })}
            >
              {category.title}
            </button>
          );
        })}
      </fieldset>

      <fieldset className="space-y-2 border-0 p-0">
        <legend className={LABEL}>{copy.priceLabel}</legend>
        <CatalogPriceSlider
          bounds={priceBounds}
          locale={locale}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          label={copy.priceLabel}
          onCommit={({ minPrice, maxPrice }) => {
            if (
              minPrice === filters.minPrice &&
              maxPrice === filters.maxPrice
            ) {
              return;
            }
            navigate({ minPrice, maxPrice });
          }}
        />
      </fieldset>

      <fieldset className="space-y-1 border-0 p-0">
        <legend className={LABEL}>{copy.inStockLabel}</legend>
        <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            checked={filters.inStock === true}
            onChange={(event) =>
              navigate({
                inStock: event.target.checked ? true : undefined,
              })
            }
          />
          <span>{copy.inStockOnly}</span>
        </label>
      </fieldset>
    </aside>
  );
}
