"use client";

import { m } from "motion/react";

import { MOTION_EASE } from "@/components/motion/motion-config";

/** Path from `public/assets/home/hero-wave.svg` (Vector 7). */
const HOME_WAVE_PATH =
  "M1132.89 40.5087C1198.49 170.207 1287.62 445.22 1119.38 507.688C909.076 585.774 746.767 409.527 638.971 567.553C531.176 725.579 691.177 918.698 506.043 992.581C344.796 1056.93 226.144 685.923 40.7525 1146.46";

const WAVE_DRAW_DURATION_S = 2.4;
const WAVE_DRAW_DELAY_S = 0.25;

type HomeHeroWaveProps = {
  /** Positioning classes for the SVG (absolute placement differs per page). */
  className: string;
};

/**
 * Yellow home stroke that draws in along its path on mount.
 */
export function HomeHeroWave({ className }: HomeHeroWaveProps) {
  return (
    <m.svg
      viewBox="0 0 1369.39 1380"
      fill="none"
      overflow="visible"
      preserveAspectRatio="none"
      className={className}
      initial="hidden"
      animate="show"
      aria-hidden
    >
      <m.path
        d={HOME_WAVE_PATH}
        stroke="#FEC604"
        strokeWidth={81}
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
  );
}
