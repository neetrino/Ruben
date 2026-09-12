"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import type { CatalogCategoryOption } from "@/features/products/application/list-catalog-products";
import {
  ALL_CATEGORIES_ICON,
  CategoryIcon,
} from "@/features/categories/ui/category-icons";
import type { CatalogPriceSliderBounds } from "@/features/products/domain/catalog-price-ranges";
import { catalogHref } from "@/features/products/domain/catalog-url";
import type { CatalogListFilter } from "@/features/products/schemas/catalog-list";
import { CATALOG_ASSETS } from "@/features/products/ui/catalog-assets";
import {
  CatalogFilterExpandable,
  CatalogFilterMoreToggle,
} from "@/features/products/ui/CatalogFilterExpand";
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
  className?: string;
};

const PANEL = "w-full rounded-[24px] bg-[rgba(131,131,131,0.08)] p-6";
const HEADING =
  "mb-3 flex items-center gap-2 text-[14px] font-bold tracking-[1px] text-black uppercase";

function categoryOptionClass(active: boolean): string {
  return [
    "flex w-full items-center gap-2 rounded-[12px] px-4 py-2 text-left text-[13px] leading-[19.5px] transition-colors",
    active
      ? "bg-black font-bold text-white"
      : "font-normal text-black hover:bg-black/5",
  ].join(" ");
}

function sortCategories(
  items: CatalogCategoryOption[],
): CatalogCategoryOption[] {
  return [...items].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.title.localeCompare(b.title);
  });
}

type CategoryTreeNode = {
  category: CatalogCategoryOption;
  children: CatalogCategoryOption[];
  totalCount: number;
};

function buildCategoryTree(
  categories: CatalogCategoryOption[],
): CategoryTreeNode[] {
  const roots = sortCategories(categories.filter((item) => !item.parentId));
  const childrenByParent = new Map<string, CatalogCategoryOption[]>();

  for (const item of categories) {
    if (!item.parentId) continue;
    const bucket = childrenByParent.get(item.parentId) ?? [];
    bucket.push(item);
    childrenByParent.set(item.parentId, bucket);
  }

  return roots.map((root) => {
    const children = sortCategories(childrenByParent.get(root.id) ?? []);
    const totalCount =
      root.productCount +
      children.reduce((sum, child) => sum + child.productCount, 0);
    return { category: root, children, totalCount };
  });
}

function toggleLocal(list: string[], id: string): string[] {
  return list.includes(id)
    ? list.filter((entry) => entry !== id)
    : [...list, id];
}

type BrandRowProps = {
  id: string;
  label: string;
  count: number;
  checked: boolean;
  tabIndex?: number;
  onToggle: () => void;
};

function BrandRow({
  id,
  label,
  count,
  checked,
  tabIndex,
  onToggle,
}: BrandRowProps) {
  return (
    <label
      key={id}
      className="flex cursor-pointer items-center gap-3 py-1.5 first:py-0"
    >
      <input
        type="checkbox"
        className="size-5 shrink-0 appearance-none rounded-[6px] border-2 border-[#ccc] bg-transparent checked:border-black checked:bg-black"
        checked={checked}
        tabIndex={tabIndex}
        onChange={onToggle}
      />
      <span className="text-[13px] leading-[19.5px] tracking-[0.5px] text-black">
        {label}
      </span>
      <span className="ml-auto text-[11px] leading-[16.5px] text-[#999]">
        {count}
      </span>
    </label>
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
  className,
}: CatalogFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [brandExpanded, setBrandExpanded] = useState(false);
  const [categoryExpanded, setCategoryExpanded] = useState(false);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [featureExpanded, setFeatureExpanded] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  function navigate(overrides: Partial<CatalogListFilter>): void {
    const href = catalogHref(locale, filters, { ...overrides, page: 1 });
    startTransition(() => {
      router.push(href);
    });
  }

  const categoryTree = useMemo(
    () => buildCategoryTree(categories),
    [categories],
  );
  const previewCategoryNodes = categoryTree.slice(0, CATALOG_CATEGORY_PREVIEW);
  const extraCategoryNodes = categoryTree.slice(CATALOG_CATEGORY_PREVIEW);

  const previewBrands = CATALOG_BRAND_OPTIONS.slice(0, CATALOG_BRAND_PREVIEW);
  const extraBrands = CATALOG_BRAND_OPTIONS.slice(CATALOG_BRAND_PREVIEW);
  const previewFeatures = CATALOG_FEATURE_OPTIONS.slice(
    0,
    CATALOG_FEATURE_PREVIEW,
  );
  const extraFeatures = CATALOG_FEATURE_OPTIONS.slice(CATALOG_FEATURE_PREVIEW);

  function toggleCategoryNode(categoryId: string): void {
    setExpandedCategoryIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }

  function renderCategoryNode(node: CategoryTreeNode): ReactNode {
    const { category, children, totalCount } = node;
    const active = filters.category === category.slug;
    const childActive = children.some(
      (child) => child.slug === filters.category,
    );
    const isOpen = expandedCategoryIds.has(category.id) || childActive;
    const hasChildren = children.length > 0;

    return (
      <div key={category.id} className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={`${categoryOptionClass(active)} min-w-0 flex-1`}
            aria-pressed={active}
            onClick={() => navigate({ category: category.slug })}
          >
            <CategoryIcon
              slug={category.slug}
              title={category.title}
              className="size-4 shrink-0"
            />
            <span className="min-w-0 flex-1 truncate">{category.title}</span>
            <span
              className={
                active
                  ? "text-[11px] text-white/60"
                  : "text-[11px] text-[#999]"
              }
            >
              {totalCount}
            </span>
          </button>
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleCategoryNode(category.id)}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-[10px] text-black/50 transition-colors hover:bg-black/5 hover:text-black"
              aria-expanded={isOpen}
              aria-label={category.title}
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : null}
        </div>
        {hasChildren && isOpen ? (
          <div className="ml-3 flex flex-col gap-1 border-l border-black/10 pl-2">
            {children.map((child) => {
              const childIsActive = filters.category === child.slug;
              return (
                <button
                  key={child.id}
                  type="button"
                  className={categoryOptionClass(childIsActive)}
                  aria-pressed={childIsActive}
                  onClick={() => navigate({ category: child.slug })}
                >
                  <CategoryIcon
                    slug={child.slug}
                    title={child.title}
                    className="size-4 shrink-0"
                  />
                  <span className="min-w-0 flex-1 truncate">{child.title}</span>
                  <span
                    className={
                      childIsActive
                        ? "text-[11px] text-white/60"
                        : "text-[11px] text-[#999]"
                    }
                  >
                    {child.productCount}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <aside
      className={[
        "flex w-full flex-col gap-6",
        className ?? "max-w-[280px]",
        isPending ? "opacity-70" : "",
      ]
        .filter(Boolean)
        .join(" ")}
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
          {previewBrands.map((brand) => (
            <BrandRow
              key={brand.id}
              id={brand.id}
              label={brand.label}
              count={brand.count}
              checked={selectedBrands.includes(brand.id)}
              onToggle={() =>
                setSelectedBrands((prev) => toggleLocal(prev, brand.id))
              }
            />
          ))}
          {extraBrands.length > 0 ? (
            <CatalogFilterExpandable expanded={brandExpanded}>
              <div className="flex flex-col gap-[3px]">
                {extraBrands.map((brand) => (
                  <BrandRow
                    key={brand.id}
                    id={brand.id}
                    label={brand.label}
                    count={brand.count}
                    checked={selectedBrands.includes(brand.id)}
                    tabIndex={brandExpanded ? 0 : -1}
                    onToggle={() =>
                      setSelectedBrands((prev) => toggleLocal(prev, brand.id))
                    }
                  />
                ))}
              </div>
            </CatalogFilterExpandable>
          ) : null}
        </div>
        {extraBrands.length > 0 ? (
          <CatalogFilterMoreToggle
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
            <ALL_CATEGORIES_ICON className="size-4 shrink-0" aria-hidden />
            <span className="min-w-0 flex-1 truncate">{copy.allCategories}</span>
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
          {previewCategoryNodes.map((node) => renderCategoryNode(node))}
          {extraCategoryNodes.length > 0 ? (
            <CatalogFilterExpandable expanded={categoryExpanded}>
              <div className="flex flex-col gap-2">
                {extraCategoryNodes.map((node) => renderCategoryNode(node))}
              </div>
            </CatalogFilterExpandable>
          ) : null}
        </div>
        {extraCategoryNodes.length > 0 ? (
          <CatalogFilterMoreToggle
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
          {previewFeatures.map((feature) => {
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
          {extraFeatures.length > 0 ? (
            <CatalogFilterExpandable expanded={featureExpanded}>
              <div className="flex flex-col gap-[3px]">
                {extraFeatures.map((feature) => {
                  const checked = selectedFeatures.includes(feature.id);
                  return (
                    <label
                      key={feature.id}
                      className="flex cursor-pointer items-center gap-3 py-1.5"
                    >
                      <input
                        type="checkbox"
                        className="size-5 shrink-0 appearance-none rounded-[6px] border-2 border-[#ccc] bg-transparent checked:border-black checked:bg-black"
                        checked={checked}
                        tabIndex={featureExpanded ? 0 : -1}
                        onChange={() =>
                          setSelectedFeatures((prev) =>
                            toggleLocal(prev, feature.id),
                          )
                        }
                      />
                      <span className="text-[13px] leading-[19.5px] text-black">
                        {feature.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </CatalogFilterExpandable>
          ) : null}
        </div>
        {extraFeatures.length > 0 ? (
          <CatalogFilterMoreToggle
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
