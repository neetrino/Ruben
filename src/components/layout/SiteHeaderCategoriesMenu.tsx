"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import { IconDropdown } from "@/components/ui/IconDropdown";

export type CategoryNavItem = {
  id: string;
  label: string;
  href: string;
  imageUrl: string | null;
};

const THUMBNAIL_SIZE_PX = 32;

type SiteHeaderCategoriesMenuProps = {
  label: string;
  categories: readonly CategoryNavItem[];
};

const TRIGGER_CLASS =
  "relative z-10 inline-flex items-center gap-1.5 pb-1.5 text-xs leading-4 tracking-[1.8px] whitespace-nowrap text-white uppercase transition-colors duration-300 hover:text-[var(--brand-deep)]";
const MENU_CLASS =
  "max-h-[min(70vh,420px)] w-max max-w-[320px] min-w-[220px] overflow-y-auto rounded-2xl border border-white/10 bg-[#212121] p-2 shadow-[0_18px_40px_rgba(0,0,0,0.45)]";
const ITEM_CLASS =
  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm leading-5 text-white/70 transition-colors hover:bg-white/10 hover:text-white";
const THUMBNAIL_CLASS =
  "relative size-8 shrink-0 overflow-hidden rounded-lg bg-white/5";

/** Navbar category picker — opens the active categories on click. */
export function SiteHeaderCategoriesMenu({
  label,
  categories,
}: SiteHeaderCategoriesMenuProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <IconDropdown
      label={label}
      menuAlign="left"
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
      {categories.map((category) => (
        <AppLink
          key={category.id}
          href={category.href}
          prefetchPolicy="intent"
          className={ITEM_CLASS}
        >
          <span className={THUMBNAIL_CLASS}>
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt=""
                width={THUMBNAIL_SIZE_PX}
                height={THUMBNAIL_SIZE_PX}
                sizes={`${THUMBNAIL_SIZE_PX}px`}
                className="size-full object-cover"
              />
            ) : null}
          </span>
          <span className="min-w-0 flex-1 truncate">{category.label}</span>
        </AppLink>
      ))}
    </IconDropdown>
  );
}
