import type { Transition, Variants } from "motion/react";

/** Shared storefront easing — matches existing sheet / reveal CSS. */
export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

export const MOTION_DURATION_PAGE_S = 0.28;
export const MOTION_DURATION_APPEAR_S = 0.38;
export const MOTION_STAGGER_S = 0.055;
export const MOTION_Y_PAGE_PX = 12;
export const MOTION_Y_APPEAR_PX = 18;
export const MOTION_MAX_STAGGER_ITEMS = 8;

export const MOTION_PAGE_TRANSITION: Transition = {
  duration: MOTION_DURATION_PAGE_S,
  ease: MOTION_EASE,
};

export const MOTION_APPEAR_TRANSITION: Transition = {
  duration: MOTION_DURATION_APPEAR_S,
  ease: MOTION_EASE,
};

export const MOTION_VIEWPORT = {
  once: true,
  amount: 0.14,
  margin: "0px 0px -6% 0px",
} as const;

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: MOTION_Y_APPEAR_PX },
  show: { opacity: 1, y: 0, transition: MOTION_APPEAR_TRANSITION },
};

export const revealListVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: MOTION_STAGGER_S,
      delayChildren: 0.04,
    },
  },
};

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: MOTION_APPEAR_TRANSITION },
};

/** Fade-only — safe inside overflow-x chip rows (no extra box, no translate clip). */
export const chipItemVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: MOTION_APPEAR_TRANSITION },
};

export const heroStaggerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: MOTION_APPEAR_TRANSITION },
};

export function appearDelay(index: number): number {
  return Math.min(index, MOTION_MAX_STAGGER_ITEMS) * MOTION_STAGGER_S;
}
