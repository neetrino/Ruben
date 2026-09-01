"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { CatalogCategoryOption } from "@/features/products/application/list-catalog-products";
import type { CatalogPriceSliderBounds } from "@/features/products/domain/catalog-price-ranges";
import { catalogHref } from "@/features/products/domain/catalog-url";
import type { CatalogListFilter } from "@/features/products/schemas/catalog-list";
import { CATALOG_ASSETS } from "@/features/products/ui/catalog-assets";
import {
  CATALOG_BRAND_OPTIONS,
  CATALOG_BRAND_PREVIEW,
  CATALOG_CATEGORY_PREVIEW,
  CATALOG_FEATURE_OPTIONS,
  CATALOG_FEATURE_PREVIEW,
} from "@/features/products/ui/catalog-filter-options";
import { CatalogPriceSlider } from "@/features/products/ui/CatalogPriceSlider";

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

type CatalogFiltersProps = {
  locale: string;
  filters: CatalogListFilter;
  categories: CatalogCategoryOption[];
  priceBounds: CatalogPriceSliderBounds;
  totalCount: number;
  copy: CatalogFiltersCopy;
};

const PANEL =
  "w-full rounded-[24px] bg-[rgba(131,131,131,0.08)] p-6";

const HEADING =
  "mb-3 flex items-center gap-2 text-[14px] font-bold tracking-[1px] text-black uppercase";

function categoryOptionClass(active: boolean): string {
  return [
    "flex w-full items-center justify-between rounded-[12px] px-4 py-2 text-left text-[13px] leading-[19.5px] transition-colors",
    active
      ? "bg-black font-bold text-white"
      : "font-normal text-black hover:bg-black/5",
  ].join(" ");
}

function MoreToggle({
  expanded,
  moreLabel,
  lessLabel,
  onToggle,
}: {
  expanded: boolean;
  moreLabel: string;
  lessLabel: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="mt-3 flex h-[34px] w-full items-center justify-between rounded-[20px] bg-[#e9e9e9] px-[15px] text-sm text-[#888]"
      aria-expanded={expanded}
      onClick={onToggle}
    >
      <span>{expanded ? lessLabel : moreLabel}</span>
      <Image
        src={CATALOG_ASSETS.filterMoreArrow}
        alt=""
        width={7}
        height={11}
        className={`h-[11px] w-[7px] transition-transform ${expanded ? "-rotate-90" : "rotate-90"}`}
        aria-hidden
      />
    </button>
  );
}

/**
 * Shop sidebar filters (Figma 119:1472): Brand, Price, Category, Features.
 */
export function CatalogFilters({
  locale,
  filters,
  categories,
  priceBounds,
  totalCount,
  copy,
}: CatalogFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [brandExpanded, setBrandExpanded] = useState(false);
  const [categoryExpanded, setCategoryExpanded] = useState(false);
  const [featureExpanded, setFeatureExpanded] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  function navigate(overrides: Partial<CatalogListFilter>): void {
    const href = catalogHref(locale, filters, { ...overrides, page: 1 });
    startTransition(() => {
      router.push(href);
    });
  }

  function toggleLocal(list: string[], id: string): string[] {
    return list.includes(id)
      ? list.filter((entry) => entry !== id)
      : [...list, id];
  }

  const visibleBrands = brandExpanded
    ? CATALOG_BRAND_OPTIONS
    : CATALOG_BRAND_OPTIONS.slice(0, CATALOG_BRAND_PREVIEW);
  const visibleCategories = categoryExpanded
    ? categories
    : categories.slice(0, CATALOG_CATEGORY_PREVIEW);
  const visibleFeatures = featureExpanded
    ? CATALOG_FEATURE_OPTIONS
    : CATALOG_FEATURE_OPTIONS.slice(0, CATALOG_FEATURE_PREVIEW);

  return (
    <aside
      className={`flex w-full max-w-[280px] flex-col gap-6 ${isPending ? "opacity-70" : ""}`}
      aria-label={copy.filtersTitle}
    >
      <section className={`${PANEL} pt-[19px] pb-6`}>
        <h2 className={`${HEADING} px-0`}>
          <span className="relative inline-flex size-[22px] shrink-0 overflow-hidden">
            <Image
              src={CATALOG_ASSETS.filterBrand}
              alt=""
              width={22}
              height={22}
              className="size-[22px]"
              aria-hidden
            />
          </span>
          {copy.brandLabel}
        </h2>
        <div className="mt-1 flex flex-col gap-[3px]">
          {visibleBrands.map((brand) => {
            const checked = selectedBrands.includes(brand.id);
            return (
              <label
                key={brand.id}
                className="flex cursor-pointer items-center gap-3 py-1.5 first:py-0"
              >
                <input
                  type="checkbox"
                  className="size-5 shrink-0 appearance-none rounded-[6px] border-2 border-[#ccc] bg-transparent checked:border-black checked:bg-black"
                  checked={checked}
                  onChange={() =>
                    setSelectedBrands((prev) => toggleLocal(prev, brand.id))
                  }
                />
                <span className="text-[13px] leading-[19.5px] tracking-[0.5px] text-black">
                  {brand.label}
                </span>
                <span className="ml-auto text-[11px] leading-[16.5px] text-[#999]">
                  {brand.count}
                </span>
              </label>
            );
          })}
        </div>
        {CATALOG_BRAND_OPTIONS.length > CATALOG_BRAND_PREVIEW ? (
          <MoreToggle
            expanded={brandExpanded}
            moreLabel={copy.moreLabel}
            lessLabel={copy.lessLabel}
            onToggle={() => setBrandExpanded((value) => !value)}
          />
        ) : null}
      </section>

      <section className={PANEL}>
        <h2 className={HEADING}>
          <span className="relative inline-flex size-4 shrink-0 overflow-hidden">
            <Image
              src={CATALOG_ASSETS.filterPrice}
              alt=""
              width={16}
              height={16}
              className="size-4"
              aria-hidden
            />
          </span>
          {copy.priceLabel}
        </h2>
        <div className="mt-4">
          <CatalogPriceSlider
            bounds={priceBounds}
            locale={locale}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            label={copy.priceLabel}
            fromLabel={copy.priceFromLabel}
            toLabel={copy.priceToLabel}
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
        </div>
      </section>

      <section className={PANEL}>
        <h2 className={HEADING}>
          <span className="relative inline-flex size-4 shrink-0 overflow-hidden">
            <Image
              src={CATALOG_ASSETS.filterCategory}
              alt=""
              width={16}
              height={16}
              className="size-4"
              aria-hidden
            />
          </span>
          {copy.categoryLabel}
        </h2>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            className={categoryOptionClass(!filters.category)}
            aria-pressed={!filters.category}
            onClick={() => navigate({ category: undefined })}
          >
            <span>{copy.allCategories}</span>
            <span
              className={
                !filters.category
                  ? "text-[11px] text-white/60"
                  : "text-[11px] text-[#999]"
              }
            >
              {totalCount}
            </span>
          </button>
          {visibleCategories.map((category) => {
            const active = filters.category === category.slug;
            return (
              <button
                key={category.slug}
                type="button"
                className={categoryOptionClass(active)}
                aria-pressed={active}
                onClick={() => navigate({ category: category.slug })}
              >
                <span>{category.title}</span>
                <span
                  className={
                    active
                      ? "text-[11px] text-white/60"
                      : "text-[11px] text-[#999]"
                  }
                >
                  {category.productCount}
                </span>
              </button>
            );
          })}
        </div>
        {categories.length > CATALOG_CATEGORY_PREVIEW ? (
          <MoreToggle
            expanded={categoryExpanded}
            moreLabel={copy.moreLabel}
            lessLabel={copy.lessLabel}
            onToggle={() => setCategoryExpanded((value) => !value)}
          />
        ) : null}
      </section>

      <section className={PANEL}>
        <h2 className={HEADING}>
          <span className="relative inline-flex size-4 shrink-0 overflow-hidden">
            <Image
              src={CATALOG_ASSETS.filterFeatures}
              alt=""
              width={16}
              height={16}
              className="size-4"
              aria-hidden
            />
          </span>
          {copy.featuresLabel}
        </h2>
        <div className="mt-4 flex flex-col gap-[3px]">
          {visibleFeatures.map((feature) => {
            const checked = selectedFeatures.includes(feature.id);
            return (
              <label
                key={feature.id}
                className="flex cursor-pointer items-center gap-3 py-1.5 first:py-0"
              >
                <input
                  type="checkbox"
                  className="size-5 shrink-0 appearance-none rounded-[6px] border-2 border-[#ccc] bg-transparent checked:border-black checked:bg-black"
                  checked={checked}
                  onChange={() =>
                    setSelectedFeatures((prev) => toggleLocal(prev, feature.id))
                  }
                />
                <span className="text-[13px] leading-[19.5px] text-black">
                  {feature.label}
                </span>
              </label>
            );
          })}
        </div>
        {CATALOG_FEATURE_OPTIONS.length > CATALOG_FEATURE_PREVIEW ? (
          <MoreToggle
            expanded={featureExpanded}
            moreLabel={copy.moreLabel}
            lessLabel={copy.lessLabel}
            onToggle={() => setFeatureExpanded((value) => !value)}
          />
        ) : null}
      </section>
    </aside>
  );
}
