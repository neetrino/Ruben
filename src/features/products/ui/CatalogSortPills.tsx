"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { catalogHref } from "@/features/products/domain/catalog-url";
import type { CatalogListFilter } from "@/features/products/schemas/catalog-list";
import {
  CATALOG_SORT_VALUES,
  type CatalogSort,
} from "@/features/products/schemas/catalog-list";

type CatalogSortPillsCopy = {
  sortLabel: string;
  sortNewest: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortPopular: string;
};

type CatalogSortPillsProps = {
  locale: string;
  filters: CatalogListFilter;
  copy: CatalogSortPillsCopy;
};

function sortLabel(
  sort: CatalogSort,
  copy: CatalogSortPillsCopy,
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

/** Display order matches Figma: Popular, New, Price ↑, Price ↓. */
const SORT_ORDER: readonly CatalogSort[] = [
  "popular",
  "newest",
  "price_asc",
  "price_desc",
];

/**
 * Pill sort controls for the shop catalog toolbar.
 */
export function CatalogSortPills({
  locale,
  filters,
  copy,
}: CatalogSortPillsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const options = SORT_ORDER.filter((value) =>
    (CATALOG_SORT_VALUES as readonly string[]).includes(value),
  ).map((value) => ({
    value,
    label: sortLabel(value, copy),
  }));

  function handleSortChange(next: string): void {
    if (next === filters.sort) return;
    const href = catalogHref(locale, filters, {
      sort: next as CatalogListFilter["sort"],
      page: 1,
    });
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <>
      <div className={`w-full lg:hidden ${isPending ? "opacity-70" : ""}`}>
        <SelectDropdown
          ariaLabel={copy.sortLabel}
          value={filters.sort}
          options={options}
          className="w-full [&>button]:h-11 [&>button]:rounded-full [&>button]:border-0 [&>button]:bg-black [&>button]:px-4 [&>button]:text-sm [&>button]:font-semibold [&>button]:text-white [&>button]:shadow-none [&>button]:hover:border-transparent [&>button>svg]:text-white"
          onValueChange={handleSortChange}
        />
      </div>

      <div
        className={`hidden flex-wrap items-center gap-2 lg:flex ${isPending ? "opacity-70" : ""}`}
      >
        <span className="text-[13px] leading-[19.5px] text-[#888]">
          {copy.sortLabel}
        </span>
        <div className="flex flex-wrap gap-2" role="group" aria-label={copy.sortLabel}>
          {options.map((option) => {
            const active = filters.sort === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                className={
                  active
                    ? "rounded-full bg-black px-4 py-1.5 text-xs leading-[18px] text-white"
                    : "rounded-full border border-[#e0e0e0] bg-white px-4 py-1.5 text-xs leading-[18px] text-black hover:border-neutral-400"
                }
                onClick={() => {
                  handleSortChange(option.value);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
