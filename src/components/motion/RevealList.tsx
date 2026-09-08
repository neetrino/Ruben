"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

import {
  MOTION_VIEWPORT,
  revealItemVariants,
  revealListVariants,
} from "@/components/motion/motion-config";

type RevealListProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "section";
  "aria-label"?: string;
  role?: "list";
};

const LIST_TAGS = {
  div: m.div,
  ul: m.ul,
  section: m.section,
} as const;

const ITEM_TAGS = {
  div: m.div,
  li: m.li,
  article: m.article,
} as const;

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
};

/**
 * Staggered appearance for grids and lists. Wrap each child in {@link RevealItem}.
 * Do not wrap items inside an `overflow-x-auto` chip row — the extra box clips pill borders.
 */
export function RevealList({
  children,
  className,
  as = "div",
  "aria-label": ariaLabel,
  role,
}: RevealListProps) {
  const Tag = LIST_TAGS[as];

  return (
    <Tag
      className={className}
      aria-label={ariaLabel}
      role={role}
      initial="hidden"
      whileInView="show"
      viewport={MOTION_VIEWPORT}
      variants={revealListVariants}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: RevealItemProps) {
  const Tag = ITEM_TAGS[as];

  return (
    <Tag className={className} variants={revealItemVariants}>
      {children}
    </Tag>
  );
}
