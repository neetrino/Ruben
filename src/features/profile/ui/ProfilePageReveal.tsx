"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

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
  const pathname = usePathname() ?? "";

  return (
    <div
      key={pathname}
      className="profile-page-reveal flex min-h-full flex-col"
      style={
        {
          "--profile-reveal-y": `${y}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
