import { Suspense } from "react";

import { SiteHeaderMainNav } from "@/components/layout/SiteHeaderMainNav";
import { getCartItemCount } from "@/features/cart/cart";
import { getCompareCount } from "@/features/compare/queries";
import { getWishlistCount } from "@/features/wishlist/queries";
import { getCurrentUser } from "@/lib/auth/session";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { Currency } from "@/lib/money/currency";

type SiteHeaderProps = {
  locale: Locale;
  currency: Currency;
  dictionary: Dictionary;
};

function HeaderControlsFallback({ brand }: { brand: string }) {
  return (
    <header className="relative z-40 px-3 pt-2 sm:px-5 lg:px-8">
      <div className="mx-auto flex max-w-[1364px] items-center justify-between gap-4 rounded-[70px] bg-[#212121] px-4 py-3 sm:px-6 sm:py-3.5 lg:px-8">
        <span className="text-sm font-semibold tracking-wide text-white uppercase">
          {brand}
        </span>
        <div
          className="h-9 w-28 animate-pulse rounded-full bg-white/10"
          aria-hidden="true"
        />
      </div>
    </header>
  );
}

async function SiteHeaderMainNavAsync({
  locale,
  currency,
  dictionary,
}: SiteHeaderProps) {
  const navItems = [
    { href: `/${locale}`, label: dictionary.nav.home },
    { href: `/${locale}/products`, label: dictionary.nav.products },
    { href: `/${locale}#categories`, label: dictionary.nav.categories },
    { href: `/${locale}#partners`, label: dictionary.nav.brands },
    { href: `/${locale}#promotions`, label: dictionary.nav.promotions },
    { href: `/${locale}/contact`, label: dictionary.nav.contact },
  ] as const;

  const [user, cartItemCount, wishlistCount, compareCount] = await Promise.all([
    getCurrentUser(),
    getCartItemCount(),
    getWishlistCount(),
    getCompareCount(),
  ]);

  return (
    <SiteHeaderMainNav
      locale={locale}
      currency={currency}
      dictionary={dictionary}
      user={user}
      navItems={navItems}
      cartItemCount={cartItemCount}
      wishlistCount={wishlistCount}
      compareCount={compareCount}
    />
  );
}

/**
 * Storefront chrome: floating dark pill navbar matching Figma TopNavBar.
 * Account/cart/wishlist/compare load in a Suspense island.
 */
export function SiteHeader({ locale, currency, dictionary }: SiteHeaderProps) {
  return (
    <div
      className="site-header sticky top-0 z-[80] shrink-0 bg-transparent"
      data-site-header
    >
      <Suspense
        fallback={<HeaderControlsFallback brand={dictionary.brand} />}
      >
        <SiteHeaderMainNavAsync
          locale={locale}
          currency={currency}
          dictionary={dictionary}
        />
      </Suspense>
    </div>
  );
}
