"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";

import { AppLink } from "@/components/ui/AppLink";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { StorefrontMobileSearchBar } from "@/components/layout/StorefrontMobileSearchBar";
import { useStorefrontHeaderScrollCollapse } from "@/components/layout/use-storefront-header-scroll-collapse";
import { HOME_MOBILE_ASSETS } from "@/features/home/config/assets";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { Currency } from "@/lib/money/currency";
import { storeMapsSearchHref } from "@/lib/store/maps";
import { toTelHref } from "@/lib/store/phone";

type StorefrontMobileTopBarProps = {
  locale: Locale;
  currency: Currency;
  dictionary: Dictionary;
  /** Server-rendered account CTA for the burger drawer. */
  accountSlot: ReactNode;
};

/**
 * Mobile storefront sticky chrome — Grill-style hide-on-scroll:
 * logo / location / call / burger collapse on scroll down; search stays pinned.
 * Shown below `lg`; desktop keeps {@link SiteHeader}.
 */
export function StorefrontMobileTopBar({
  locale,
  currency,
  dictionary,
  accountSlot,
}: StorefrontMobileTopBarProps) {
  const pathname = usePathname();
  const homeHref = `/${locale}`;
  const isHomePage = pathname === homeHref || pathname === `${homeHref}/`;

  // Same source as the footer and the contact page: the first branch is the
  // primary one, so the header never drifts from the published store data.
  const [primaryBranch] = dictionary.contact.branches;
  const phoneHref = primaryBranch?.phone
    ? toTelHref(primaryBranch.phone)
    : null;
  const mapsHref = primaryBranch
    ? storeMapsSearchHref(dictionary.brand, primaryBranch.address)
    : null;

  const navItems = [
    { href: `/${locale}`, label: dictionary.nav.home },
    { href: `/${locale}/products`, label: dictionary.nav.products },
    { href: `/${locale}/brands`, label: dictionary.nav.brands },
    { href: `/${locale}/contact`, label: dictionary.nav.contact },
  ] as const;

  const headerRootRef = useRef<HTMLDivElement>(null);
  const { primaryHidden, allowMotion, scrollHomeToTop } =
    useStorefrontHeaderScrollCollapse(headerRootRef);

  const motionClass = allowMotion
    ? "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
    : "duration-0";

  return (
    <div
      ref={headerRootRef}
      className="storefront-mobile-top-bar sticky top-0 z-[80] shrink-0 bg-white [overflow-anchor:none] lg:hidden"
      data-storefront-mobile-top-bar
    >
      <div
        className={`grid transition-[grid-template-rows] ${motionClass} ${
          primaryHidden ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        }`}
        aria-hidden={primaryHidden}
      >
        <div className="min-h-0 overflow-hidden [overflow-anchor:none]">
          <div
            className={`origin-top px-[14px] pt-2.5 transition-[opacity,transform] ${motionClass} ${
              primaryHidden
                ? "pointer-events-none -translate-y-2 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <AppLink
                href={homeHref}
                prefetchPolicy="intent"
                className="relative block h-[52px] w-[85px] shrink-0"
                aria-label={dictionary.brand}
                onClick={(event) => {
                  if (!isHomePage) {
                    return;
                  }
                  event.preventDefault();
                  scrollHomeToTop();
                }}
              >
                <Image
                  src={HOME_MOBILE_ASSETS.logo}
                  alt={dictionary.brand}
                  fill
                  priority
                  sizes="85px"
                  className="object-contain object-left"
                />
              </AppLink>

              <div className="flex items-center gap-[5px]">
                {mapsHref ? (
                  <a
                    href={mapsHref}
                    aria-label={dictionary.contact.mapTitle}
                    className="inline-flex size-12 items-center justify-center rounded-full bg-[var(--brand)]"
                  >
                    <Image
                      src={HOME_MOBILE_ASSETS.location}
                      alt=""
                      width={22}
                      height={27}
                      className="h-[22px] w-[18px]"
                      aria-hidden
                    />
                  </a>
                ) : null}
                {phoneHref ? (
                  <a
                    href={phoneHref}
                    aria-label={dictionary.contact.callTitle}
                    className="block size-12"
                  >
                    <Image
                      src={HOME_MOBILE_ASSETS.phone}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12"
                      aria-hidden
                    />
                  </a>
                ) : null}
                <MobileNavDrawer
                  locale={locale}
                  currency={currency}
                  dictionary={dictionary}
                  navItems={navItems}
                  accountSlot={accountSlot}
                  appearance="mobile-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-[14px] pt-3 pb-3 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <StorefrontMobileSearchBar
          locale={locale}
          searchPlaceholder={dictionary.header.searchPlaceholder}
          searchSubmitLabel={dictionary.header.search}
          filtersLabel={dictionary.catalog.filtersTitle}
        />
      </div>
    </div>
  );
}
