"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { PageAppear } from "@/components/motion/PageAppear";

/**
 * Sections that keep persistent chrome inside their own layout and run their
 * own inner reveal. Navigating between their sub-routes must not restart the
 * storefront-wide appear — that would remount and shift the section chrome.
 */
const SELF_ANIMATED_SECTIONS: readonly string[] = ["profile"];

/** `/hy/profile/orders` → `/hy/profile`; other routes keep the full pathname. */
function getPageTransitionKey(pathname: string): string {
  const [locale, section] = pathname.split("/").filter(Boolean);
  if (!locale || !section || !SELF_ANIMATED_SECTIONS.includes(section)) {
    return pathname;
  }
  return `/${locale}/${section}`;
}

type StorefrontPageAppearProps = {
  children: ReactNode;
};

/**
 * Storefront page transition: fade + rise per route, collapsed to the section
 * root for sections that animate their own content column.
 */
export function StorefrontPageAppear({ children }: StorefrontPageAppearProps) {
  const pathname = usePathname() ?? "";

  return (
    <PageAppear transitionKey={getPageTransitionKey(pathname)}>
      {children}
    </PageAppear>
  );
}
