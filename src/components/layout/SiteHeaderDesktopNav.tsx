"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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

type IndicatorBox = {
  left: number;
  width: number;
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
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState<IndicatorBox | null>(null);
  const [ready, setReady] = useState(false);

  const activeKey =
    items.find((item) => isActive(pathname, item.href, locale))?.href ?? null;

  const measure = useCallback(() => {
    const nav = navRef.current;
    if (!nav || !activeKey) {
      setIndicator(null);
      return;
    }
    const link = linkRefs.current.get(activeKey);
    if (!link) {
      setIndicator(null);
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    setIndicator({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
    });
    setReady(true);
  }, [activeKey]);

  useLayoutEffect(() => {
    measure();
  }, [measure, items]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(onResize)
        : null;
    observer?.observe(nav);

    return () => {
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
    };
  }, [measure]);

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className="relative hidden items-center gap-8 lg:flex"
    >
      {items.map((item) => {
        const active = isActive(pathname, item.href, locale);
        const key = `${item.href}-${item.label}`;
        return (
          <AppLink
            key={key}
            href={item.href}
            prefetchPolicy="intent"
            ref={(node) => {
              if (node) {
                linkRefs.current.set(item.href, node);
              } else {
                linkRefs.current.delete(item.href);
              }
            }}
            className={
              active
                ? "relative z-10 pb-1.5 text-xs leading-4 tracking-[1.8px] text-[var(--brand-deep)] uppercase transition-colors duration-300"
                : "relative z-10 pb-1.5 text-xs leading-4 tracking-[1.8px] text-white uppercase transition-colors duration-300 hover:text-[var(--brand-deep)]"
            }
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </AppLink>
        );
      })}

      {indicator ? (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-[var(--brand-deep)]"
          style={{
            left: indicator.left,
            width: indicator.width,
            opacity: ready ? 1 : 0,
            transition:
              "left 320ms cubic-bezier(0.22, 1, 0.36, 1), width 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease",
          }}
        />
      ) : null}
    </nav>
  );
}
