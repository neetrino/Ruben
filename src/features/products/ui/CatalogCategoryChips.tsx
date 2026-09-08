import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import type { CatalogCategoryOption } from "@/features/products/application/list-catalog-products";
import { catalogHref } from "@/features/products/domain/catalog-url";
import type { CatalogListFilter } from "@/features/products/schemas/catalog-list";
import { CATALOG_ASSETS } from "@/features/products/ui/catalog-assets";

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
      ? "bg-[#1f1f1f] text-white"
      : "border border-[#1f1f1f] bg-white text-[#1f1f1f] hover:bg-neutral-50",
  ].join(" ");
}

function chipIconSrc(index: number): string {
  const icons = CATALOG_ASSETS.chipIcons;
  return icons[index % icons.length] ?? CATALOG_ASSETS.chipAll;
}

/**
 * Horizontal category quick filters matching Figma Shop page chips.
 */
export function CatalogCategoryChips({
  locale,
  filters,
  categories,
  allLabel,
}: CatalogCategoryChipsProps) {
  const allActive = !filters.category;

  return (
    <div
      className="flex gap-3 overflow-x-auto px-6 [scrollbar-width:none] sm:px-10 lg:px-12 [&::-webkit-scrollbar]:hidden"
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
        <Image
          src={CATALOG_ASSETS.chipAll}
          alt=""
          width={20}
          height={20}
          className={`size-5 ${allActive ? "brightness-0 invert" : ""}`}
          aria-hidden
        />
        {allLabel}
      </AppLink>

      {categories.map((category, index) => {
        const active = filters.category === category.slug;
        return (
          <AppLink
            key={category.slug}
            href={catalogHref(locale, filters, {
              category: category.slug,
              page: 1,
            })}
            prefetchPolicy="intent"
            className={chipClass(active)}
            aria-current={active ? "page" : undefined}
            role="listitem"
          >
            <Image
              src={chipIconSrc(index)}
              alt=""
              width={20}
              height={20}
              className={`size-5 ${active ? "brightness-0 invert" : ""}`}
              aria-hidden
            />
            {category.title}
          </AppLink>
        );
      })}
    </div>
  );
}
