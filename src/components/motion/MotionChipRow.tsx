"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

import {
  MOTION_VIEWPORT,
  chipItemVariants,
  revealListVariants,
} from "@/components/motion/motion-config";

type MotionChipRowProps = {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  role?: "list";
};

type MotionChipProps = {
  children: ReactNode;
};

/**
 * Staggered chip row. Each chip stays `shrink-0` and fades only — no extra
 * box that can compress pill width or clip the border.
 */
export function MotionChipRow({
  children,
  className,
  "aria-label": ariaLabel,
  role,
}: MotionChipRowProps) {
  return (
    <m.div
      className={className}
      aria-label={ariaLabel}
      role={role}
      initial="hidden"
      whileInView="show"
      viewport={MOTION_VIEWPORT}
      variants={revealListVariants}
    >
      {children}
    </m.div>
  );
}

export function MotionChip({ children }: MotionChipProps) {
  return (
    <m.div className="shrink-0" variants={chipItemVariants}>
      {children}
    </m.div>
  );
}
