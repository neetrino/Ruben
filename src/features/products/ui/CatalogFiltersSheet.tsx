"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { SideSheet } from "@/components/ui/SideSheet";
import { HOME_MOBILE_ASSETS } from "@/features/home/config/assets";
import type { CatalogCategoryOption } from "@/features/products/application/list-catalog-products";
import type { CatalogPriceSliderBounds } from "@/features/products/domain/catalog-price-ranges";
import type { CatalogListFilter } from "@/features/products/schemas/catalog-list";
import { CatalogFilters } from "@/features/products/ui/CatalogFilters";

export const OPEN_CATALOG_FILTERS_EVENT = "storefront:open-catalog-filters";

const SHEET_OPEN_STORAGE_KEY = "catalog-filters-sheet-open";

/** Opens the shop filters sheet when mounted on `/products`. */
export function openCatalogFiltersSheet(): void {
  try {
    sessionStorage.setItem(SHEET_OPEN_STORAGE_KEY, "1");
  } catch {
    // Ignore private-mode / unavailable storage.
  }
  window.dispatchEvent(new CustomEvent(OPEN_CATALOG_FILTERS_EVENT));
}

/** Mark the sheet to open after navigating to `/products`. */
export function prepareCatalogFiltersSheetOpen(): void {
  try {
    sessionStorage.setItem(SHEET_OPEN_STORAGE_KEY, "1");
  } catch {
    // Ignore.
  }
}

type CatalogFiltersCopy = {
  brandLabel: string;
  priceLabel: string;
  priceFromLabel: string;
  priceToLabel: string;
  categoryLabel: string;
  allCategories: string;
  featuresLabel: string;
  moreLabel: string;
  lessLabel: string;
  filtersTitle: string;
};

type CatalogFiltersSheetProps = {
  locale: string;
  filters: CatalogListFilter;
  categories: CatalogCategoryOption[];
  priceBounds: CatalogPriceSliderBounds;
  totalCount: number;
  copy: CatalogFiltersCopy;
  applyLabel: string;
  resultsLabel?: string;
};

/**
 * Mobile shop filters sheet — same SideSheet chrome as {@link CartDrawer}.
 * Desktop keeps the sticky sidebar.
 */
export function CatalogFiltersSheet({
  locale,
  filters,
  categories,
  priceBounds,
  totalCount,
  copy,
  applyLabel,
  resultsLabel,
}: CatalogFiltersSheetProps) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SHEET_OPEN_STORAGE_KEY) === "1") {
        setOpen(true);
      }
    } catch {
      // Ignore private-mode / unavailable storage.
    }
  }, []);

  useEffect(() => {
    function onOpenRequest(): void {
      setOpen(true);
      try {
        sessionStorage.setItem(SHEET_OPEN_STORAGE_KEY, "1");
      } catch {
        // Ignore.
      }
    }

    window.addEventListener(OPEN_CATALOG_FILTERS_EVENT, onOpenRequest);
    return () => {
      window.removeEventListener(OPEN_CATALOG_FILTERS_EVENT, onOpenRequest);
    };
  }, []);

  useEffect(() => {
    if (!pathname.includes("/products")) {
      setOpen(false);
      try {
        sessionStorage.removeItem(SHEET_OPEN_STORAGE_KEY);
      } catch {
        // Ignore.
      }
    }
  }, [pathname]);

  function close(): void {
    setOpen(false);
    try {
      sessionStorage.removeItem(SHEET_OPEN_STORAGE_KEY);
    } catch {
      // Ignore.
    }
  }

  function openSheet(): void {
    setOpen(true);
    try {
      sessionStorage.setItem(SHEET_OPEN_STORAGE_KEY, "1");
    } catch {
      // Ignore.
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openSheet}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-black px-4 text-sm font-semibold text-white lg:hidden lg:w-auto"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Image
          src={HOME_MOBILE_ASSETS.filter}
          alt=""
          width={18}
          height={18}
          className="size-[18px]"
          aria-hidden
        />
        {copy.filtersTitle}
      </button>

      <SideSheet
        open={open}
        onClose={close}
        ariaLabel={copy.filtersTitle}
        panelClassName="w-[87%] max-w-[420px]"
        zIndexClassName="z-[200]"
        backdropBlur
      >
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            {copy.filtersTitle}
          </h2>
          {resultsLabel ? (
            <p className="mt-1 text-sm text-gray-500">{resultsLabel}</p>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          <CatalogFilters
            locale={locale}
            filters={filters}
            categories={categories}
            priceBounds={priceBounds}
            totalCount={totalCount}
            copy={copy}
            className="max-w-none"
          />
        </div>

        <div className="border-t border-gray-200 px-6 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={close}
            className="flex min-h-[50px] w-full items-center justify-center rounded-full bg-[var(--brand)] px-4 text-sm font-semibold text-black transition-colors hover:brightness-95"
          >
            {applyLabel}
          </button>
        </div>
      </SideSheet>
    </>
  );
}
