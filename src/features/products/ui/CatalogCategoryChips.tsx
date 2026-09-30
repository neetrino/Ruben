"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from "react";

import { AppLink } from "@/components/ui/AppLink";
import {
  ALL_CATEGORIES_ICON,
  CategoryIcon,
} from "@/features/categories/ui/category-icons";
import { HomeCategoriesSheet } from "@/features/home/ui/HomeCategoriesSheet";
import type { CatalogCategoryOption } from "@/features/products/application/list-catalog-products";
import { catalogHref } from "@/features/products/domain/catalog-url";
import type { CatalogListFilter } from "@/features/products/schemas/catalog-list";

type CatalogCategoryChipsProps = {
  locale: string;
  filters: CatalogListFilter;
  categories: CatalogCategoryOption[];
  allLabel: string;
  closeLabel: string;
};

const SCROLL_EDGE_PX = 8;
/** Ignore click jitter. Capture and suppress navigation only after a real drag. */
const DRAG_CLICK_THRESHOLD_PX = 10;

/** Visual chip styles only — keep `display` out so hide/show utilities do not conflict. */
function chipTone(active: boolean): string {
  return [
    "shrink-0 items-center gap-2 rounded-full px-5 py-2 text-sm whitespace-nowrap transition-colors",
    active
      ? "bg-[var(--brand)] text-black"
      : "border border-[#1f1f1f] bg-white text-[#1f1f1f] hover:bg-neutral-50",
  ].join(" ");
}

function chipClass(active: boolean): string {
  return `inline-flex ${chipTone(active)}`;
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
 * On mobile, “All” opens the same categories bottom sheet as the home page.
 * Desktop: drag / wheel to scroll when the chip row overflows; edge fades hint more content.
 */
export function CatalogCategoryChips({
  locale,
  filters,
  categories,
  allLabel,
  closeLabel,
}: CatalogCategoryChipsProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
  const allHref = catalogHref(locale, filters, {
    category: undefined,
    page: 1,
  });
  const sheetCategories = roots.map((category) => ({
    id: category.id,
    title: category.title,
    slug: category.slug,
    href: catalogHref(locale, filters, {
      category: category.slug,
      page: 1,
    }),
    imageUrl: null,
  }));

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > SCROLL_EDGE_PX);
    setCanScrollRight(el.scrollLeft < maxScroll - SCROLL_EDGE_PX);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(() => updateScrollState());
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState, roots.length]);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    if (event.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;
    if (el.scrollWidth <= el.clientWidth) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
  }, []);

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag || !el || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    if (!drag.moved) {
      if (Math.abs(deltaX) < DRAG_CLICK_THRESHOLD_PX) return;
      drag.moved = true;
      setIsDragging(true);
      // Capture only after a drag starts. Capturing on pointerdown retargets
      // the click away from the category link, so a tap never navigates.
      el.setPointerCapture(event.pointerId);
    }

    el.scrollLeft = drag.startScrollLeft - deltaX;
    event.preventDefault();
  }, []);

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (drag.moved && el) {
      const scrolled = el.scrollLeft !== drag.startScrollLeft;
      if (scrolled) {
        suppressClickRef.current = true;
        // Click is dispatched after pointerup. If the browser drops it, clear
        // the flag so the next category tap is not swallowed.
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
    }
    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  const onClickCapture = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
    <>
      <div className="relative">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-14 bg-gradient-to-r from-white to-transparent transition-opacity lg:block ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-14 bg-gradient-to-l from-white to-transparent transition-opacity lg:block ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          ref={scrollerRef}
          className={`flex gap-3 overflow-x-auto px-[13px] [scrollbar-width:none] sm:px-10 lg:cursor-grab lg:px-12 lg:active:cursor-grabbing [&::-webkit-scrollbar]:hidden ${
            isDragging ? "select-none lg:cursor-grabbing" : ""
          }`}
          role="list"
          aria-label="Categories"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
        >
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={categoriesOpen}
            aria-controls="home-categories-sheet"
            onClick={() => setCategoriesOpen(true)}
            className={`inline-flex ${chipTone(allActive)} lg:hidden`}
            role="listitem"
          >
            <AllIcon className="size-5 shrink-0" aria-hidden />
            {allLabel}
          </button>
          <AppLink
            href={allHref}
            prefetchPolicy="intent"
            className={`hidden lg:inline-flex ${chipTone(allActive)}`}
            aria-current={allActive ? "page" : undefined}
            role="listitem"
            draggable={false}
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
                draggable={false}
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
      </div>

      <HomeCategoriesSheet
        open={categoriesOpen}
        onClose={() => setCategoriesOpen(false)}
        categories={sheetCategories}
        allCategoriesLabel={allLabel}
        allHref={allHref}
        ariaLabel={allLabel}
        closeLabel={closeLabel}
      />
    </>
  );
}
