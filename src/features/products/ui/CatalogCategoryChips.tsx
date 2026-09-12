"use client";

import { AppLink } from "@/components/ui/AppLink";
import {
  ALL_CATEGORIES_ICON,
  CategoryIcon,
} from "@/features/categories/ui/category-icons";
import type { CatalogCategoryOption } from "@/features/products/application/list-catalog-products";
import { catalogHref } from "@/features/products/domain/catalog-url";
import type { CatalogListFilter } from "@/features/products/schemas/catalog-list";

type CatalogCategoryChipsProps = {
  locale: string;
  filters: CatalogListFilter;
  categories: CatalogCategoryOption[];
  allLabel: string;
};

function chipClass(active: boolean): string {
  return [
    "inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-sm whitespace-nowrap transition-colors",
    active
      ? "bg-[var(--brand)] text-black"
      : "border border-[#1f1f1f] bg-white text-[#1f1f1f] hover:bg-neutral-50",
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

/**
 * Horizontal category quick filters matching Figma Shop page chips.
 * Shows root categories only; a root stays active when one of its children is selected.
 */
export function CatalogCategoryChips({
  locale,
  filters,
  categories,
  allLabel,
}: CatalogCategoryChipsProps) {
  const roots = sortCategories(
    categories.filter((category) => !category.parentId),
  );

  const selected = filters.category
    ? categories.find((category) => category.slug === filters.category)
    : undefined;
  const selectedRootSlug = selected
    ? selected.parentId
      ? categories.find((category) => category.id === selected.parentId)?.slug
      : selected.slug
    : null;

  const allActive = !filters.category;
  const AllIcon = ALL_CATEGORIES_ICON;

  return (
    <div
      className="flex gap-3 overflow-x-auto px-[13px] [scrollbar-width:none] sm:px-10 lg:px-12 [&::-webkit-scrollbar]:hidden"
      role="list"
      aria-label="Categories"
    >
      <AppLink
        href={catalogHref(locale, filters, { category: undefined, page: 1 })}
        prefetchPolicy="intent"
        className={chipClass(allActive)}
        aria-current={allActive ? "page" : undefined}
        role="listitem"
      >
        <AllIcon className="size-5 shrink-0" aria-hidden />
        {allLabel}
      </AppLink>

      {roots.map((category) => {
        const active = selectedRootSlug === category.slug;
        return (
          <AppLink
            key={category.id}
            href={catalogHref(locale, filters, {
              category: category.slug,
              page: 1,
            })}
            prefetchPolicy="intent"
            className={chipClass(active)}
            aria-current={active ? "page" : undefined}
            role="listitem"
          >
            <CategoryIcon
              slug={category.slug}
              title={category.title}
              className="size-5 shrink-0"
            />
            {category.title}
          </AppLink>
        );
      })}
    </div>
  );
}
