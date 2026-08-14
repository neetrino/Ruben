"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { catalogHref } from "@/features/products/domain/catalog-url";
import type { CatalogListFilter } from "@/features/products/schemas/catalog-list";
import { CATALOG_SORT_VALUES } from "@/features/products/schemas/catalog-list";

type CatalogSortSelectCopy = {
  sortLabel: string;
  sortNewest: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortPopular: string;
};

type CatalogSortSelectProps = {
  locale: string;
  filters: CatalogListFilter;
  copy: CatalogSortSelectCopy;
};

function sortOptionLabel(
  sort: (typeof CATALOG_SORT_VALUES)[number],
  copy: CatalogSortSelectCopy,
): string {
  switch (sort) {
    case "price_asc":
      return copy.sortPriceAsc;
    case "price_desc":
      return copy.sortPriceDesc;
    case "popular":
      return copy.sortPopular;
    case "newest":
    default:
      return copy.sortNewest;
  }
}

export function CatalogSortSelect({
  locale,
  filters,
  copy,
}: CatalogSortSelectProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const options = CATALOG_SORT_VALUES.map((value) => ({
    value,
    label: sortOptionLabel(value, copy),
  }));

  return (
    <div className={`w-full max-w-xs sm:w-56 ${isPending ? "opacity-70" : ""}`}>
      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
        {copy.sortLabel}
      </span>
      <SelectDropdown
        ariaLabel={copy.sortLabel}
        value={filters.sort}
        options={options}
        className="mt-1"
        onValueChange={(next) => {
          if (next === filters.sort) return;
          const href = catalogHref(locale, filters, {
            sort: next as CatalogListFilter["sort"],
            page: 1,
          });
          startTransition(() => {
            router.push(href);
          });
        }}
      />
    </div>
  );
}
