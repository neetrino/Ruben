"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";

import { AppLink } from "@/components/ui/AppLink";
import { HOME_MOBILE_ASSETS } from "@/features/home/config/assets";
import { catalogHref } from "@/features/products/domain/catalog-url";
import { DEFAULT_CATALOG_FILTERS } from "@/features/products/schemas/catalog-list";
import { openCatalogFiltersSheet, prepareCatalogFiltersSheetOpen } from "@/features/products/ui/CatalogFiltersSheet";
import type { Locale } from "@/lib/i18n/config";

type StorefrontMobileSearchBarProps = {
  locale: Locale;
  searchPlaceholder: string;
  searchSubmitLabel: string;
  filtersLabel: string;
};

/**
 * Mobile catalog search + filters shortcut (Figma home 171:562).
 * On `/products`, the filter button opens the catalog filters sheet.
 */
export function StorefrontMobileSearchBar({
  locale,
  searchPlaceholder,
  searchSubmitLabel,
  filtersLabel,
}: StorefrontMobileSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const searchId = useId();
  const [query, setQuery] = useState("");
  const productsHref = `/${locale}/products`;
  const onShopPage =
    pathname === productsHref || pathname === `${productsHref}/`;

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(
      catalogHref(locale, DEFAULT_CATALOG_FILTERS, {
        q: trimmed || undefined,
        page: 1,
      }),
    );
  }

  function onFiltersClick(): void {
    openCatalogFiltersSheet();
  }

  return (
    <form
      onSubmit={onSearchSubmit}
      className="flex items-center gap-3"
      role="search"
    >
      <label
        htmlFor={searchId}
        className="flex h-14 min-w-0 flex-1 items-center gap-2 rounded-full bg-[#f3f4f6] px-4"
      >
        <Image
          src={HOME_MOBILE_ASSETS.search}
          alt=""
          width={18}
          height={20}
          className="h-5 w-[18px] shrink-0 opacity-50"
          aria-hidden
        />
        <input
          id={searchId}
          type="search"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent text-base text-neutral-800 outline-none placeholder:text-[#9ca3af]"
          autoComplete="off"
        />
        <span className="sr-only">{searchSubmitLabel}</span>
      </label>

      {onShopPage ? (
        <button
          type="button"
          aria-label={filtersLabel}
          onClick={onFiltersClick}
          className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-black"
        >
          <Image
            src={HOME_MOBILE_ASSETS.filter}
            alt=""
            width={24}
            height={24}
            className="size-6"
            aria-hidden
          />
        </button>
      ) : (
        <AppLink
          href={productsHref}
          prefetchPolicy="intent"
          aria-label={filtersLabel}
          className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-black"
          onClick={() => {
            prepareCatalogFiltersSheetOpen();
          }}
        >
          <Image
            src={HOME_MOBILE_ASSETS.filter}
            alt=""
            width={24}
            height={24}
            className="size-6"
            aria-hidden
          />
        </AppLink>
      )}
    </form>
  );
}
