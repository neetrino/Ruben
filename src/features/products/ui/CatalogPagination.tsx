import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import { catalogHref } from "@/features/products/domain/catalog-url";
import type { CatalogListFilter } from "@/features/products/schemas/catalog-list";
import { CATALOG_ASSETS } from "@/features/products/ui/catalog-assets";

type CatalogPaginationProps = {
  locale: string;
  filters: CatalogListFilter;
  totalPages: number;
  paginationLabel: string;
  previousLabel: string;
  nextLabel: string;
};

function pageWindow(current: number, total: number): number[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(current - 2, total - 4));
  return Array.from({ length: 5 }, (_, index) => start + index);
}

/**
 * Numbered catalog pagination matching Figma shop controls.
 */
export function CatalogPagination({
  locale,
  filters,
  totalPages,
  paginationLabel,
  previousLabel,
  nextLabel,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = pageWindow(filters.page, totalPages);
  const controlClass =
    "inline-flex h-9 items-center gap-1 rounded-2xl border border-[#e9e9e9] bg-white px-3 text-sm text-[#313131] hover:bg-neutral-50";
  const pageClass = (active: boolean) =>
    active
      ? "inline-flex h-9 min-w-9 items-center justify-center rounded-2xl bg-black px-3 text-sm font-bold text-white"
      : "inline-flex h-9 min-w-9 items-center justify-center rounded-2xl border border-[#e9e9e9] bg-white px-3 text-sm text-[#313131] hover:bg-neutral-50";

  return (
    <nav
      aria-label={paginationLabel}
      className="flex flex-wrap items-center justify-center gap-1.5"
    >
      {filters.page > 1 ? (
        <AppLink
          href={catalogHref(locale, filters, { page: filters.page - 1 })}
          prefetchPolicy="intent"
          className={controlClass}
        >
          <Image
            src={CATALOG_ASSETS.paginationPrev}
            alt=""
            width={16}
            height={16}
            className="size-4"
            aria-hidden
          />
          {previousLabel}
        </AppLink>
      ) : (
        <span className={`${controlClass} pointer-events-none opacity-40`}>
          <Image
            src={CATALOG_ASSETS.paginationPrev}
            alt=""
            width={16}
            height={16}
            className="size-4"
            aria-hidden
          />
          {previousLabel}
        </span>
      )}

      {pages.map((page) => {
        const active = page === filters.page;
        if (active) {
          return (
            <span
              key={page}
              aria-current="page"
              className={pageClass(true)}
            >
              {page}
            </span>
          );
        }
        return (
          <AppLink
            key={page}
            href={catalogHref(locale, filters, { page })}
            prefetchPolicy="intent"
            className={pageClass(false)}
          >
            {page}
          </AppLink>
        );
      })}

      {filters.page < totalPages ? (
        <AppLink
          href={catalogHref(locale, filters, { page: filters.page + 1 })}
          prefetchPolicy="intent"
          className={controlClass}
        >
          {nextLabel}
          <Image
            src={CATALOG_ASSETS.paginationNext}
            alt=""
            width={16}
            height={16}
            className="size-4"
            aria-hidden
          />
        </AppLink>
      ) : (
        <span className={`${controlClass} pointer-events-none opacity-40`}>
          {nextLabel}
          <Image
            src={CATALOG_ASSETS.paginationNext}
            alt=""
            width={16}
            height={16}
            className="size-4"
            aria-hidden
          />
        </span>
      )}
    </nav>
  );
}
