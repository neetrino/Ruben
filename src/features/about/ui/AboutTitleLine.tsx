"use client";

import { m, type Variants } from "motion/react";

import { MOTION_EASE } from "@/components/motion/motion-config";

type AboutTitleLineProps = {
  className?: string;
};

const TITLE_LINE_DURATION_S = 0.7;
const TITLE_LINE_DELAY_S = 0.18;

const titleLineVariants: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: {
      duration: TITLE_LINE_DURATION_S,
      delay: TITLE_LINE_DELAY_S,
      ease: MOTION_EASE,
    },
  },
};

/**
 * Section accent that draws in from the left with the parent Reveal.
 */
export function AboutTitleLine({ className = "" }: AboutTitleLineProps) {
  return (
    <m.div
      className={`mt-5 h-1 w-14 origin-left rounded-full bg-brand ${className}`}
      aria-hidden
      variants={titleLineVariants}
    />
  );
}
