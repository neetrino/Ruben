"use client";

import Image from "next/image";
import Link from "next/link";

import { HEADER_ASSETS } from "@/components/layout/header-assets";
import {
  ADMIN_BRAND_LOGO_CLASS,
  ADMIN_BRAND_LOGO_COLLAPSED_CLASS,
} from "@/features/admin/ui/admin-shell-classes";
import { useAdminSidebarCollapse } from "@/features/admin/ui/AdminSidebarCollapseContext";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";

type AdminSidebarBrandProps = {
  locale: string;
};

/** Yellow-tinted wordmark for the black admin sidebar. */
const ADMIN_LOGO_FILTER =
  "brightness(0) saturate(100%) invert(84%) sepia(42%) saturate(1200%) hue-rotate(1deg) brightness(104%) contrast(103%)";

export function AdminSidebarBrand({ locale }: AdminSidebarBrandProps) {
  const { collapsed, toggleCollapsed } = useAdminSidebarCollapse();
  const t = adminCopy(locale);

  return (
    <div
      className={`flex shrink-0 border-b border-white/15 pb-3 pt-2 ${
        collapsed
          ? "flex-col items-center gap-2 px-1"
          : "items-center justify-between gap-2 pl-3 pr-2"
      }`}
    >
      <Link
        href={`/${locale}`}
        className={
          collapsed ? ADMIN_BRAND_LOGO_COLLAPSED_CLASS : ADMIN_BRAND_LOGO_CLASS
        }
        title={t.nav.brandHome}
        aria-label={t.nav.brand}
      >
        <Image
          src={HEADER_ASSETS.logo}
          alt={t.nav.brand}
          width={57}
          height={35}
          priority
          className="h-full w-full object-contain object-left"
          style={{ filter: ADMIN_LOGO_FILTER }}
        />
      </Link>
      <button
        type="button"
        onClick={toggleCollapsed}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 text-white/80 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
        aria-expanded={!collapsed}
        aria-label={collapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
        title={collapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
      >
        {collapsed ? (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
