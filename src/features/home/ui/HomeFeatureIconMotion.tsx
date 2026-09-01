import type { CSSProperties, ReactNode } from "react";

import {
  HOME_FEATURE_ICON_MOTION_TIMING,
  type HomeFeatureIconMotionKind,
} from "@/features/home/ui/home-feature-icon-motion";
import styles from "@/features/home/ui/HomeFeatureIconMotion.module.css";

type HomeFeatureIconMotionProps = {
  motion: HomeFeatureIconMotionKind;
  className?: string;
  children: ReactNode;
};

/** Idle float wrapper for home feature section icons (MaMarie-style). */
export function HomeFeatureIconMotion({
  motion,
  className = "",
  children,
}: HomeFeatureIconMotionProps) {
  const timing = HOME_FEATURE_ICON_MOTION_TIMING[motion];

  return (
    <div
      className={`${styles.root} ${styles[motion]} ${className}`.trim()}
      style={
        {
          "--home-feature-motion-duration": `${timing.durationMs}ms`,
          "--home-feature-motion-delay": `${timing.delayMs}ms`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
