import { AccountControls } from "@/components/layout/AccountControls";
import { HEADER_ASSETS } from "@/components/layout/header-assets";
import { LocaleCurrencySwitcher } from "@/components/layout/LocaleCurrencySwitcher";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { SiteHeaderCartTrigger } from "@/components/layout/SiteHeaderCartTrigger";
import { SiteHeaderDesktopNav } from "@/components/layout/SiteHeaderDesktopNav";
import { SiteHeaderLogoLink } from "@/components/layout/SiteHeaderLogoLink";
import { CompareHeaderLink } from "@/features/compare/ui/CompareHeaderLink";
import { HeaderSearch } from "@/features/products/ui/HeaderSearch";
import { WishlistHeaderLink } from "@/features/wishlist/ui/WishlistHeaderLink";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { Currency } from "@/lib/money/currency";
import type { SessionUser } from "@/lib/auth/session";

function headerSearchLabels(header: Dictionary["header"]): {
  open: string;
  close: string;
  placeholder: string;
  idle: string;
  empty: string;
  viewAll: string;
} {
  return {
    open: header.search,
    close: header.searchClose,
    placeholder: header.searchPlaceholder,
    idle: header.searchIdle,
    empty: header.searchEmpty,
    viewAll: header.searchViewAll,
  };
}

type NavItem = {
  href: string;
  label: string;
};

type SiteHeaderMainNavProps = {
  locale: Locale;
  currency: Currency;
  dictionary: Dictionary;
  user: SessionUser | null;
  navItems: readonly NavItem[];
  cartItemCount: number;
  wishlistCount: number;
  compareCount: number;
};

const ICON_BUTTON =
  "relative inline-flex size-[35px] items-center justify-center text-white outline-none transition-opacity hover:opacity-80";

export function SiteHeaderMainNav({
  locale,
  currency,
  dictionary,
  user,
  navItems,
  cartItemCount,
  wishlistCount,
  compareCount,
}: SiteHeaderMainNavProps) {
  const searchLabels = headerSearchLabels(dictionary.header);

  return (
    <header className="relative z-40 px-3 pt-2 sm:px-5 lg:px-[38px] lg:pt-[26px]">
      <div className="mx-auto flex h-14 max-w-[1364px] items-center justify-between rounded-[70px] bg-[#212121] px-4 sm:h-[63px] sm:px-6 lg:px-[69px]">
        <SiteHeaderLogoLink locale={locale} brandLabel={dictionary.brand} />

        <SiteHeaderDesktopNav locale={locale} items={navItems} />

        <div className="flex items-center gap-2">
          <HeaderSearch
            locale={locale}
            currency={currency}
            labels={searchLabels}
          />

          <div className="hidden items-center gap-2 md:flex">
            <WishlistHeaderLink
              locale={locale}
              label={dictionary.nav.wishlist}
              count={wishlistCount}
              className={ICON_BUTTON}
              iconSrc={HEADER_ASSETS.wishlist}
            />
            <CompareHeaderLink
              locale={locale}
              label={dictionary.nav.compare}
              count={compareCount}
              className={ICON_BUTTON}
              iconSrc={HEADER_ASSETS.compare}
            />
            <SiteHeaderCartTrigger
              locale={locale}
              currency={currency}
              dictionary={dictionary}
              itemCount={cartItemCount}
              variant="desktop"
            />

            <LocaleCurrencySwitcher
              locale={locale}
              currency={currency}
              currencyLabel={dictionary.header.currency}
              languageLabel={dictionary.header.language}
              appearance="navbar"
            />

            <AccountControls
              locale={locale}
              loginLabel={dictionary.header.login}
              logoutLabel={dictionary.header.logout}
              profileLabel={dictionary.header.profile}
              adminLabel={dictionary.header.admin}
              user={user}
              appearance="navbar"
            />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LocaleCurrencySwitcher
              locale={locale}
              currency={currency}
              currencyLabel={dictionary.header.currency}
              languageLabel={dictionary.header.language}
              appearance="navbar"
            />
            <SiteHeaderCartTrigger
              locale={locale}
              currency={currency}
              dictionary={dictionary}
              itemCount={cartItemCount}
              variant="mobile"
            />
            <MobileNavDrawer
              locale={locale}
              dictionary={dictionary}
              navItems={navItems}
              appearance="navbar"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
