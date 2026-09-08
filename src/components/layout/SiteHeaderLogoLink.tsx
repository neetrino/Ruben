"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

import { HEADER_ASSETS } from "@/components/layout/header-assets";
import { AppLink } from "@/components/ui/AppLink";
import type { Locale } from "@/lib/i18n/config";

type SiteHeaderLogoLinkProps = {
  locale: Locale;
  brandLabel: string;
};

function isHomePath(pathname: string, locale: Locale): boolean {
  return pathname === `/${locale}` || pathname === `/${locale}/`;
}

export function SiteHeaderLogoLink({
  locale,
  brandLabel,
}: SiteHeaderLogoLinkProps) {
  const pathname = usePathname() ?? `/${locale}`;
  const homeHref = `/${locale}`;

  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    if (!isHomePath(pathname, locale)) return;
    event.preventDefault();
    if (window.location.hash) {
      window.history.replaceState(null, "", homeHref);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AppLink
      href={homeHref}
      prefetchPolicy="intent"
      onClick={handleClick}
      className="relative z-10 shrink-0 outline-none"
      aria-label={brandLabel}
    >
      <Image
        src={HEADER_ASSETS.logo}
        alt={brandLabel}
        width={57}
        height={35}
        priority
        className="h-[28px] w-auto sm:h-[35px] sm:w-[57px]"
      />
    </AppLink>
  );
}
