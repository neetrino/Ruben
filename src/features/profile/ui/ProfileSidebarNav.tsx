"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Lock,
  LogOut,
  MapPin,
  Package,
  Trash2,
  User,
} from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import {
  SLIDING_NAV_TRANSITION_MS,
  useSlidingNavIndicator,
} from "@/components/ui/useSlidingNavIndicator";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type ProfileSidebarNavProps = {
  locale: Locale;
  dictionary: Dictionary["profile"];
  logoutAction: (formData: FormData) => void | Promise<void>;
};

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  exact?: boolean;
  danger?: boolean;
};

function buildNavItems(
  locale: Locale,
  dictionary: Dictionary["profile"],
): NavItem[] {
  return [
    {
      href: `/${locale}/profile`,
      label: dictionary.dashboard,
      icon: <LayoutDashboard className="h-4 w-4" />,
      exact: true,
    },
    {
      href: `/${locale}/profile/orders`,
      label: dictionary.orders,
      icon: <Package className="h-4 w-4" />,
    },
    {
      href: `/${locale}/profile/personal-information`,
      label: dictionary.personal,
      icon: <User className="h-4 w-4" />,
    },
    {
      href: `/${locale}/profile/addresses`,
      label: dictionary.addresses,
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      href: `/${locale}/profile/password`,
      label: dictionary.password,
      icon: <Lock className="h-4 w-4" />,
    },
    {
      href: `/${locale}/profile/delete-account`,
      label: dictionary.deleteAccount,
      icon: <Trash2 className="h-4 w-4" />,
      danger: true,
    },
  ];
}

function isItemActive(pathname: string, item: NavItem): boolean {
  if (item.exact) {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function ProfileSidebarNav({
  locale,
  dictionary,
  logoutAction,
}: ProfileSidebarNavProps) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const items = buildNavItems(locale, dictionary);

  useEffect(() => {
    router.prefetch(`/${locale}/profile`);
    router.prefetch(`/${locale}/profile/orders`);
    router.prefetch(`/${locale}/profile/personal-information`);
    router.prefetch(`/${locale}/profile/addresses`);
    router.prefetch(`/${locale}/profile/password`);
    router.prefetch(`/${locale}/profile/delete-account`);
  }, [locale, router]);

  const activeHref =
    items.find((item) => isItemActive(pathname, item))?.href ??
    items[0]?.href ??
    "";
  const { navRef, indicator, slideEnabled, registerItem } =
    useSlidingNavIndicator(activeHref);

  return (
    <div className="p-2 sm:p-3">
      <nav
        ref={navRef}
        className="relative flex flex-col gap-0.5"
        aria-label={dictionary.title}
        style={
          {
            "--profile-nav-ms": `${SLIDING_NAV_TRANSITION_MS}ms`,
          } as CSSProperties
        }
      >
        {indicator ? (
          <span
            aria-hidden
            className={`pointer-events-none absolute right-0 left-0 z-0 rounded-md border-l-[3px] border-gray-900 bg-white/85 shadow-sm ${
              slideEnabled
                ? "profile-nav-indicator"
                : "profile-nav-indicator-instant"
            }`}
            style={{ top: indicator.top, height: indicator.height }}
          />
        ) : null}

        {items.map((item) => {
          const active = item.href === activeHref;
          const danger = Boolean(item.danger);
          return (
            <AppLink
              key={item.href}
              href={item.href}
              prefetchPolicy="intent"
              ref={(node) => registerItem(item.href, node)}
              className={`relative z-10 flex w-full items-center gap-3 rounded-md border-l-[3px] border-transparent px-3 py-2 text-left text-sm font-medium transition-colors ${
                active ? "" : danger ? "hover:bg-red-50/70" : "hover:bg-white/50"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={
                  danger
                    ? "flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600"
                    : active
                      ? "flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-900 shadow-sm"
                      : "flex h-8 w-8 items-center justify-center rounded-md bg-gray-100/80 text-gray-500"
                }
              >
                {item.icon}
              </span>
              <span
                className={`profile-nav-label min-w-0 flex-1 ${
                  danger
                    ? "text-red-600"
                    : active
                      ? "text-gray-900"
                      : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
            </AppLink>
          );
        })}
      </nav>

      <div className="mt-2 border-t border-gray-200/70 pt-2">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md border-l-[3px] border-transparent px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-white/50 hover:text-gray-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-600">
              <LogOut className="h-4 w-4" />
            </span>
            {dictionary.logout}
          </button>
        </form>
      </div>
    </div>
  );
}
