"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

type AdminPageRevealProps = {
  children: ReactNode;
};

/** Soft rise on admin route change (CSS, no motion dependency). */
export function AdminPageReveal({ children }: AdminPageRevealProps) {
  const pathname = usePathname() ?? "";

  return (
    <div
      key={pathname}
      className="admin-page-reveal flex min-h-full flex-col"
      style={{ "--admin-reveal-y": "24px" } as CSSProperties}
    >
      {children}
    </div>
  );
}
