"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { CATALOG_ASSETS } from "@/features/products/ui/catalog-assets";

export const CATALOG_FILTER_EXPAND_MS = 320;

type MoreToggleProps = {
  expanded: boolean;
  moreLabel: string;
  lessLabel: string;
  onToggle: () => void;
};

export function CatalogFilterMoreToggle({
  expanded,
  moreLabel,
  lessLabel,
  onToggle,
}: MoreToggleProps) {
  return (
    <button
      type="button"
      className="mt-3 flex h-[34px] w-full items-center justify-between rounded-[20px] bg-[#e9e9e9] px-[15px] text-sm text-[#888] transition-colors hover:bg-[#e2e2e2]"
      aria-expanded={expanded}
      onClick={onToggle}
    >
      <span>{expanded ? lessLabel : moreLabel}</span>
      <Image
        src={CATALOG_ASSETS.filterMoreArrow}
        alt=""
        width={7}
        height={11}
        className={`h-[11px] w-[7px] transition-transform duration-300 ease-out ${
          expanded ? "-rotate-90" : "rotate-90"
        }`}
        aria-hidden
      />
    </button>
  );
}

type ExpandableExtraProps = {
  expanded: boolean;
  children: ReactNode;
};

/** Smooth height reveal for filter “More” extras. */
export function CatalogFilterExpandable({
  expanded,
  children,
}: ExpandableExtraProps) {
  return (
    <div
      className="grid transition-[grid-template-rows] ease-out"
      style={{
        gridTemplateRows: expanded ? "1fr" : "0fr",
        transitionDuration: `${CATALOG_FILTER_EXPAND_MS}ms`,
      }}
      aria-hidden={!expanded}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
