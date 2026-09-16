"use client";

import { m } from "motion/react";

import { MOTION_EASE } from "@/components/motion/motion-config";

/** Figma Vector 7 path from `public/assets/about/hero-wave.svg`. */
const HERO_WAVE_PATH =
  "M144.73 389.09C-36.4715 241.167 15.033 38.5529 126.384 26.9244C427.407 -4.51196 384.636 494.895 502.031 473.475C619.427 452.054 569.87 199.713 754.374 158.912C1173.54 66.2171 1027.48 581.435 1313.17 461.857";

const WAVE_DRAW_DURATION_S = 2.4;
const WAVE_DRAW_DELAY_S = 0.25;

/**
 * Yellow hero stroke that draws in along its path (bottom → top of the curve).
 */
export function AboutHeroWave() {
  return (
    <div
      className="pointer-events-none absolute z-[1] flex items-center justify-center"
      style={{
        top: "-41.97%",
        right: "-0.86%",
        bottom: "-22.17%",
        left: "3.96%",
      }}
      aria-hidden
    >
      <m.svg
        viewBox="0 0 1338.68 505.467"
        fill="none"
        overflow="visible"
        className="max-w-none origin-center select-none"
        style={{
          width: "min(1288px, 105%)",
          height: "auto",
          aspectRatio: "1339 / 505",
          transform: "rotate(-45.38deg)",
        }}
        initial="hidden"
        animate="show"
      >
        <m.path
          d={HERO_WAVE_PATH}
          stroke="#FEC604"
          strokeWidth={51}
          strokeLinecap="round"
          fill="none"
          variants={{
            hidden: { pathLength: 0, opacity: 0.35 },
            show: {
              pathLength: 1,
              opacity: 1,
              transition: {
                pathLength: {
                  duration: WAVE_DRAW_DURATION_S,
                  delay: WAVE_DRAW_DELAY_S,
                  ease: MOTION_EASE,
                },
                opacity: {
                  duration: 0.35,
                  delay: WAVE_DRAW_DELAY_S,
                },
              },
            },
          }}
        />
      </m.svg>
    </div>
  );
}
