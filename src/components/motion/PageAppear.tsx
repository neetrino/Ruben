"use client";

import { m } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  MOTION_PAGE_TRANSITION,
  MOTION_Y_PAGE_PX,
} from "@/components/motion/motion-config";

type PageAppearProps = {
  children: ReactNode;
  className?: string;
  y?: number;
  /** Replay trigger. Defaults to the pathname — override to skip sub-routes. */
  transitionKey?: string;
};

/**
 * Fast fade + rise on route change. Exit is skipped — App Router unmounts immediately.
 */
export function PageAppear({
  children,
  className,
  y = MOTION_Y_PAGE_PX,
  transitionKey,
}: PageAppearProps) {
  const pathname = usePathname() ?? "";

  return (
    <m.div
      key={transitionKey ?? pathname}
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={MOTION_PAGE_TRANSITION}
    >
      {children}
    </m.div>
  );
}
