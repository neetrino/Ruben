"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

import {
  MOTION_APPEAR_TRANSITION,
  MOTION_VIEWPORT,
  MOTION_Y_APPEAR_PX,
  revealVariants,
} from "@/components/motion/motion-config";

type RevealTag = "div" | "section" | "article" | "header" | "ul" | "li";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** `inView` waits for the viewport; `mount` plays immediately (above-the-fold). */
  mode?: "inView" | "mount";
  as?: RevealTag;
};

const TAGS = {
  div: m.div,
  section: m.section,
  article: m.article,
  header: m.header,
  ul: m.ul,
  li: m.li,
} as const;

/**
 * Appearance animation: opacity + translateY only (GPU-friendly).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = MOTION_Y_APPEAR_PX,
  mode = "inView",
  as = "div",
}: RevealProps) {
  const Tag = TAGS[as];
  const transition = { ...MOTION_APPEAR_TRANSITION, delay };
  const customY = y !== MOTION_Y_APPEAR_PX;

  return (
    <Tag
      className={className}
      variants={customY ? undefined : revealVariants}
      initial={customY ? { opacity: 0, y } : "hidden"}
      animate={mode === "mount" ? (customY ? { opacity: 1, y: 0 } : "show") : undefined}
      whileInView={mode === "inView" ? (customY ? { opacity: 1, y: 0 } : "show") : undefined}
      viewport={mode === "inView" ? MOTION_VIEWPORT : undefined}
      transition={customY || delay > 0 ? transition : undefined}
    >
      {children}
    </Tag>
  );
}
