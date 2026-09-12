"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import { IconDropdown } from "@/components/ui/IconDropdown";
import { getCategoryIcon } from "@/features/categories/ui/category-icons";

export type CategoryNavItem = {
  id: string;
  label: string;
  slug: string;
  href: string;
  imageUrl: string | null;
  parentId: string | null;
  sortOrder: number;
};

type CategoryNavNode = {
  category: CategoryNavItem;
  children: CategoryNavItem[];
};

const THUMBNAIL_SIZE_PX = 32;

type SiteHeaderCategoriesMenuProps = {
  label: string;
  categories: readonly CategoryNavItem[];
};

const TRIGGER_CLASS =
  "relative z-10 inline-flex items-center gap-1.5 pb-1.5 text-xs leading-4 tracking-[1.8px] whitespace-nowrap text-white uppercase transition-colors duration-300 hover:text-[var(--brand-deep)]";
const MENU_CLASS =
  "max-h-[min(70vh,420px)] w-max max-w-[320px] min-w-[240px] overflow-y-auto rounded-2xl border border-white/10 bg-[#212121] p-2 shadow-[0_18px_40px_rgba(0,0,0,0.45)]";
const ITEM_CLASS =
  "flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2 text-sm leading-5 text-white/70 transition-colors hover:bg-white/10 hover:text-white";
const THUMBNAIL_CLASS =
  "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-white/10";

function sortNavItems(items: readonly CategoryNavItem[]): CategoryNavItem[] {
  return [...items].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.label.localeCompare(b.label);
  });
}

function buildCategoryTree(
  categories: readonly CategoryNavItem[],
): CategoryNavNode[] {
  const roots = sortNavItems(categories.filter((item) => !item.parentId));
  const childrenByParent = new Map<string, CategoryNavItem[]>();

  for (const item of categories) {
    if (!item.parentId) continue;
    const bucket = childrenByParent.get(item.parentId) ?? [];
    bucket.push(item);
    childrenByParent.set(item.parentId, bucket);
  }

  return roots.map((root) => ({
    category: root,
    children: sortNavItems(childrenByParent.get(root.id) ?? []),
  }));
}

function CategoryThumb({
  imageUrl,
  slug,
  label,
}: {
  imageUrl: string | null;
  slug: string;
  label: string;
}) {
  const FallbackIcon = getCategoryIcon(slug, label);

  return (
    <span className={THUMBNAIL_CLASS}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          width={THUMBNAIL_SIZE_PX}
          height={THUMBNAIL_SIZE_PX}
          sizes={`${THUMBNAIL_SIZE_PX}px`}
          className="size-full object-contain"
        />
      ) : (
        <FallbackIcon className="size-4 text-white/55" aria-hidden />
      )}
    </span>
  );
}

/** Navbar category picker — root categories expand to show children on click. */
export function SiteHeaderCategoriesMenu({
  label,
  categories,
}: SiteHeaderCategoriesMenuProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);

  if (tree.length === 0) {
    return null;
  }

  function toggleExpanded(categoryId: string): void {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }

  return (
    <IconDropdown
      label={label}
      menuAlign="center"
      openOnHover
      closeOnScroll
      triggerClassName={TRIGGER_CLASS}
      menuClassName={MENU_CLASS}
      trigger={(open) => (
        <>
          <span>{label}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ease-out motion-reduce:transition-none ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </>
      )}
    >
      <ul className="flex flex-col gap-0.5">
        {tree.map(({ category, children }) => {
          const isExpanded = expandedIds.has(category.id);
          const hasChildren = children.length > 0;

          return (
            <li key={category.id}>
              <div className="flex items-center gap-0.5">
                <AppLink
                  href={category.href}
                  prefetchPolicy="intent"
                  className={ITEM_CLASS}
                >
                  <CategoryThumb
                    imageUrl={category.imageUrl}
                    slug={category.slug}
                    label={category.label}
                  />
                  <span className="min-w-0 flex-1 truncate">{category.label}</span>
                </AppLink>
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleExpanded(category.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      event.stopPropagation();
                      toggleExpanded(category.id);
                    }}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-white/45 transition-colors hover:bg-white/10 hover:text-white"
                    aria-expanded={isExpanded}
                    aria-label={category.label}
                    data-keep-menu-open
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                ) : null}
              </div>

              {hasChildren && isExpanded ? (
                <ul className="mt-0.5 mb-1 ml-4 space-y-0.5 border-l border-white/10 pl-2">
                  {children.map((child) => (
                    <li key={child.id}>
                      <AppLink
                        href={child.href}
                        prefetchPolicy="intent"
                        className={ITEM_CLASS}
                      >
                        <CategoryThumb
                          imageUrl={child.imageUrl}
                          slug={child.slug}
                          label={child.label}
                        />
                        <span className="min-w-0 flex-1 truncate">
                          {child.label}
                        </span>
                      </AppLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </IconDropdown>
  );
}
