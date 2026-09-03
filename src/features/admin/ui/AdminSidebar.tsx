"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

import {
  SLIDING_NAV_TRANSITION_MS,
  useSlidingNavIndicator,
} from "@/components/ui/useSlidingNavIndicator";
import {
  getAdminMenuItems,
  isAdminTabActive,
  type AdminMenuItem,
} from "@/features/admin/ui/admin-menu.config";
import { AdminMenuDrawer } from "@/features/admin/ui/AdminMenuDrawer";
import { AdminSidebarBrand } from "@/features/admin/ui/AdminSidebarBrand";
import { useAdminSidebarCollapse } from "@/features/admin/ui/AdminSidebarCollapseContext";
import {
  ADMIN_BRAND_LOGO_CLASS,
  ADMIN_SIDEBAR_ASIDE,
  ADMIN_SIDEBAR_MOBILE_DRAWER_WRAP,
  ADMIN_SIDEBAR_NAV,
} from "@/features/admin/ui/admin-shell-classes";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import { useAdminProductsSubnavExpanded } from "@/features/admin/ui/useAdminProductsSubnavExpanded";

type AdminSidebarProps = {
  locale: string;
};

function isNestedVisible(
  tab: AdminMenuItem,
  pathname: string,
  locale: string,
  collapsed: boolean,
  productsNestedExpanded: boolean,
): boolean {
  if (tab.parentGroupId !== "products") return true;
  if (collapsed) return true;
  if (isAdminTabActive(tab.href, pathname, locale)) return true;
  return productsNestedExpanded;
}

function navIconClass(active: boolean): string {
  return active
    ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)] text-black"
    : "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white";
}

function navLabelClass(active: boolean): string {
  return active ? "text-black" : "text-white";
}

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname() ?? `/${locale}/admin`;
  const t = adminCopy(locale);
  const tabs = getAdminMenuItems(locale, t.nav);
  const { collapsed } = useAdminSidebarCollapse();
  const [productsNestedExpanded, toggleProductsNested] =
    useAdminProductsSubnavExpanded(pathname, locale);

  const visibleTabs = tabs.filter((tab) =>
    isNestedVisible(
      tab,
      pathname,
      locale,
      collapsed,
      productsNestedExpanded,
    ),
  );

  const activeHref =
    [...visibleTabs]
      .filter((tab) => isAdminTabActive(tab.href, pathname, locale))
      .sort((left, right) => right.href.length - left.href.length)[0]?.href ??
    "";

  const { navRef, indicator, slideEnabled, registerItem } =
    useSlidingNavIndicator(activeHref);

  const asideWidthClass = collapsed ? "lg:w-16" : "lg:w-64";

  return (
    <>
      <div className={ADMIN_SIDEBAR_MOBILE_DRAWER_WRAP}>
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/${locale}`}
            className={ADMIN_BRAND_LOGO_CLASS}
            aria-label={t.nav.brand}
          >
            <Image
              src="/assets/home/ruben-logo.svg"
              alt={t.nav.brand}
              width={72}
              height={44}
              priority
              className="h-full w-full object-contain object-left"
            />
          </Link>
          <AdminMenuDrawer locale={locale} pathname={pathname} />
        </div>
      </div>
      <aside className={`${ADMIN_SIDEBAR_ASIDE} ${asideWidthClass}`}>
        <AdminSidebarBrand locale={locale} />
        <nav
          ref={navRef}
          className={`${ADMIN_SIDEBAR_NAV} ${collapsed ? "px-1" : "px-2"}`}
          style={
            {
              "--profile-nav-ms": `${SLIDING_NAV_TRANSITION_MS}ms`,
            } as CSSProperties
          }
        >
          {indicator ? (
            <span
              aria-hidden
              className={`pointer-events-none absolute right-0 left-0 z-0 rounded-2xl bg-[var(--brand)] shadow-sm ${
                slideEnabled
                  ? "profile-nav-indicator"
                  : "profile-nav-indicator-instant"
              }`}
              style={{ top: indicator.top, height: indicator.height }}
            />
          ) : null}

          {visibleTabs.map((tab) => {
            const isActive = tab.href === activeHref;

            if (tab.id === "products" && !collapsed) {
              return (
                <div
                  key={tab.id}
                  ref={(node) => registerItem(tab.href, node)}
                  className={`relative z-10 flex w-full min-w-0 overflow-hidden rounded-2xl ${
                    isActive ? "" : "hover:bg-white/10"
                  }`}
                >
                  <Link
                    href={tab.href}
                    title={tab.label}
                    className={`flex min-w-0 flex-1 items-center gap-3 px-3 py-2 text-left text-sm font-semibold tracking-wide uppercase ${navLabelClass(isActive)}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className={navIconClass(isActive)}>{tab.icon}</span>
                    <span className="profile-nav-label min-w-0 flex-1 truncate">
                      {tab.label}
                    </span>
                  </Link>
                  <button
                    type="button"
                    aria-expanded={productsNestedExpanded}
                    aria-label={t.nav.toggleProductSubpages}
                    title={t.nav.toggleProductSubpages}
                    onClick={(event) => {
                      event.preventDefault();
                      toggleProductsNested();
                    }}
                    className={`shrink-0 border-l px-2 py-2 transition-colors ${
                      isActive
                        ? "border-black/20 text-black hover:bg-black/5"
                        : "border-white/20 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <svg
                      className={`h-5 w-5 transition-transform ${productsNestedExpanded ? "" : "-rotate-90"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              );
            }

            return (
              <Link
                key={tab.id}
                href={tab.href}
                title={tab.label}
                ref={(node) => registerItem(tab.href, node)}
                className={`relative z-10 flex w-full items-center gap-3 rounded-2xl py-2 text-left text-sm font-semibold tracking-wide uppercase ${
                  collapsed ? "justify-center px-0" : "px-3"
                } ${tab.isSubCategory && !collapsed ? "pl-10" : ""} ${
                  isActive ? "" : "hover:bg-white/10"
                } ${navLabelClass(isActive)}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className={navIconClass(isActive)}>{tab.icon}</span>
                {collapsed ? null : (
                  <span className="profile-nav-label min-w-0 flex-1 truncate">
                    {tab.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
