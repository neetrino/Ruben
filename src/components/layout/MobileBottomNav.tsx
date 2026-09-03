"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

import { AppLink } from "@/components/ui/AppLink";
import { CartDrawer } from "@/features/cart/ui/CartDrawer";
import { HOME_MOBILE_ASSETS } from "@/features/home/config/assets";
import { useWishlistCount } from "@/features/wishlist/wishlist-client-sync";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { Currency } from "@/lib/money/currency";

type MobileBottomNavProps = {
  locale: Locale;
  currency: Currency;
  dictionary: Dictionary;
  cartItemCount: number;
  wishlistCount: number;
  isSignedIn: boolean;
};

type NavIconSize = {
  width: number;
  height: number;
  className: string;
};

type NavTab = {
  id: string;
  href: string;
  label: string;
  iconSrc: string;
  iconSize: NavIconSize;
  match: (pathname: string) => boolean;
  badge?: number;
};

const ICON_HOME: NavIconSize = {
  width: 26,
  height: 26,
  className: "size-[26px]",
};
const ICON_SHOP: NavIconSize = {
  width: 24,
  height: 24,
  className: "h-5 w-6",
};
const ICON_BAG: NavIconSize = {
  width: 24,
  height: 24,
  className: "size-6",
};
const ICON_HEART: NavIconSize = {
  width: 26,
  height: 26,
  className: "size-[26px]",
};
const ICON_USER: NavIconSize = {
  width: 20,
  height: 24,
  className: "h-6 w-5",
};

function isHomePath(pathname: string, locale: Locale): boolean {
  return pathname === `/${locale}` || pathname === `/${locale}/`;
}

function startsWithPath(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}

/** Figma 171:544 — 52px circles; color eases between white and brand. */
function tabButtonClass(active: boolean): string {
  return [
    "relative inline-flex size-[52px] shrink-0 items-center justify-center rounded-full outline-none",
    "transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    active ? "bg-[var(--brand)]" : "bg-white",
  ].join(" ");
}

function NavBadge({
  count,
  active = false,
}: {
  count: number;
  active?: boolean;
}) {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      className={[
        "absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold",
        "transition-colors duration-300",
        active
          ? "bg-white text-black ring-1 ring-black/10"
          : "bg-[var(--brand)] text-black",
      ].join(" ")}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

function TabIcon({ src, size }: { src: string; size: NavIconSize }) {
  return (
    <Image
      src={src}
      alt=""
      width={size.width}
      height={size.height}
      className={size.className}
      unoptimized
      aria-hidden
    />
  );
}

function LinkTab({ tab, active }: { tab: NavTab; active: boolean }) {
  return (
    <AppLink
      href={tab.href}
      prefetchPolicy="intent"
      aria-label={tab.label}
      aria-current={active ? "page" : undefined}
      className={tabButtonClass(active)}
    >
      <span className="relative inline-flex items-center justify-center">
        <TabIcon src={tab.iconSrc} size={tab.iconSize} />
        {tab.badge != null ? (
          <NavBadge count={tab.badge} active={active} />
        ) : null}
      </span>
    </AppLink>
  );
}

/**
 * Floating pill bottom nav — Figma Home mobile Container (171:543).
 */
export function MobileBottomNav({
  locale,
  currency,
  dictionary,
  cartItemCount,
  wishlistCount,
  isSignedIn,
}: MobileBottomNavProps) {
  const pathname = usePathname() ?? `/${locale}`;
  const wishlistBadgeCount = useWishlistCount(wishlistCount);
  const profileHref = isSignedIn
    ? `/${locale}/profile`
    : `/${locale}/login`;

  const homeTab: NavTab = {
    id: "home",
    href: `/${locale}`,
    label: dictionary.nav.home,
    iconSrc: HOME_MOBILE_ASSETS.navHome,
    iconSize: ICON_HOME,
    match: (path) => isHomePath(path, locale),
  };

  const shopTab: NavTab = {
    id: "shop",
    href: `/${locale}/products`,
    label: dictionary.nav.shop,
    iconSrc: HOME_MOBILE_ASSETS.navShop,
    iconSize: ICON_SHOP,
    match: (path) => startsWithPath(path, `/${locale}/products`),
  };

  const wishlistTab: NavTab = {
    id: "wishlist",
    href: `/${locale}/wishlist`,
    label: dictionary.nav.wishlist,
    iconSrc: HOME_MOBILE_ASSETS.navHeart,
    iconSize: ICON_HEART,
    match: (path) => startsWithPath(path, `/${locale}/wishlist`),
    badge: wishlistBadgeCount,
  };

  const profileTab: NavTab = {
    id: "profile",
    href: profileHref,
    label: dictionary.header.profile,
    iconSrc: HOME_MOBILE_ASSETS.navUser,
    iconSize: ICON_USER,
    match: (path) =>
      startsWithPath(path, `/${locale}/profile`) ||
      startsWithPath(path, `/${locale}/login`),
  };

  return (
    <nav
      aria-label={dictionary.nav.navigation}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-[22px] pb-[max(16px,env(safe-area-inset-bottom))] md:hidden"
    >
      <div className="pointer-events-auto flex max-w-[338px] items-center gap-3 rounded-[60px] bg-[rgba(33,33,33,0.71)] py-2.5 pr-2.5 pl-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-[10px]">
        <LinkTab tab={homeTab} active={homeTab.match(pathname)} />
        <LinkTab tab={shopTab} active={shopTab.match(pathname)} />

        <CartDrawer
          locale={locale}
          currency={currency}
          dictionary={dictionary}
          itemCount={cartItemCount}
          renderTrigger={({
            open,
            badgeCount,
            label,
            openDrawer,
            prefetchDrawerView,
          }) => (
            <button
              type="button"
              onClick={openDrawer}
              onPointerEnter={prefetchDrawerView}
              onFocus={prefetchDrawerView}
              aria-label={label}
              aria-expanded={open}
              className={tabButtonClass(open)}
              data-cart-target
            >
              <span className="relative inline-flex items-center justify-center">
                <TabIcon src={HOME_MOBILE_ASSETS.navBag} size={ICON_BAG} />
                <NavBadge count={badgeCount} active={open} />
              </span>
            </button>
          )}
        />

        <LinkTab tab={wishlistTab} active={wishlistTab.match(pathname)} />
        <LinkTab tab={profileTab} active={profileTab.match(pathname)} />
      </div>
    </nav>
  );
}
