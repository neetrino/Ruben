"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

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

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${isPending ? "opacity-70" : ""}`}
    >
      <span className="text-[13px] leading-[19.5px] text-[#888]">
        {copy.sortLabel}
      </span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={copy.sortLabel}>
        {SORT_ORDER.filter((value) =>
          (CATALOG_SORT_VALUES as readonly string[]).includes(value),
        ).map((value) => {
          const active = filters.sort === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              className={
                active
                  ? "rounded-full bg-black px-4 py-1.5 text-xs leading-[18px] text-white"
                  : "rounded-full border border-[#e0e0e0] bg-white px-4 py-1.5 text-xs leading-[18px] text-black hover:border-neutral-400"
              }
              onClick={() => {
                if (value === filters.sort) return;
                const href = catalogHref(locale, filters, {
                  sort: value,
                  page: 1,
                });
                startTransition(() => {
                  router.push(href);
                });
              }}
            >
              {sortLabel(value, copy)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
