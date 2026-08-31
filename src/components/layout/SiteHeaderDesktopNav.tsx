"use client";

import { usePathname } from "next/navigation";

import { AppLink } from "@/components/ui/AppLink";
import type { Locale } from "@/lib/i18n/config";

type NavItem = {
  href: string;
  label: string;
};

type SiteHeaderDesktopNavProps = {
  locale: Locale;
  items: readonly NavItem[];
};

function isActive(pathname: string, href: string, locale: Locale): boolean {
  if (href.includes("#")) {
    return false;
  }
  const home = `/${locale}`;
  if (href === home || href === `${home}/`) {
    return pathname === home || pathname === `${home}/`;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeaderDesktopNav({
  locale,
  items,
}: SiteHeaderDesktopNavProps) {
  const pathname = usePathname() ?? `/${locale}`;

  return (
    <nav
      aria-label="Primary"
      className="hidden items-center gap-8 lg:flex"
    >
      {items.map((item) => {
        const active = isActive(pathname, item.href, locale);
        return (
          <AppLink
            key={`${item.href}-${item.label}`}
            href={item.href}
            prefetchPolicy="intent"
            className={
              active
                ? "border-b-2 border-[var(--brand-deep)] pb-1.5 text-xs leading-4 tracking-[1.8px] text-[var(--brand-deep)] uppercase"
                : "text-xs leading-4 tracking-[1.8px] text-white uppercase transition-colors hover:text-[var(--brand-deep)]"
            }
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </AppLink>
        );
      })}
    </nav>
  );
}
