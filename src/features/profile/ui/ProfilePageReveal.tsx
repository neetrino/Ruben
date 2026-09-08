"use client";

import type { ReactNode } from "react";

import { PageAppear } from "@/components/motion/PageAppear";

type ProfilePageRevealProps = {
  children: ReactNode;
  /** Entrance rise in px. Use `0` inside the mobile tab sheet. */
  y?: number;
};

/**
 * Soft rise on section mount / route change for profile content.
 */
export function ProfilePageReveal({
  children,
  y = 18,
}: ProfilePageRevealProps) {
  return (
    <PageAppear className="flex min-h-full flex-col" y={y}>
      {children}
    </PageAppear>
  );
}
