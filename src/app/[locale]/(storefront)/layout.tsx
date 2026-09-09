import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { StorefrontPageAppear } from "@/components/motion/StorefrontPageAppear";
import { MobileBottomNavIsland } from "@/components/layout/MobileBottomNavIsland";
import { MobileNavAccountAction } from "@/components/layout/MobileNavAccountAction";
import { SiteCopyright } from "@/components/layout/SiteCopyright";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { StorefrontMobileTopBar } from "@/components/layout/StorefrontMobileTopBar";
import { MaintenanceGate } from "@/components/layout/MaintenanceGate";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  CURRENCY_COOKIE_NAME,
  parseCurrencyCookie,
} from "@/lib/money/currency-cookie";

type StorefrontLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function StorefrontLayout({
  children,
  params,
}: StorefrontLayoutProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);
  const cookieStore = await cookies();
  const currency = parseCurrencyCookie(
    cookieStore.get(CURRENCY_COOKIE_NAME)?.value,
  );

  return (
    <div className="storefront-shell flex min-h-dvh flex-1 flex-col bg-white">
      <StorefrontMobileTopBar
        locale={locale}
        currency={currency}
        dictionary={dictionary}
        accountSlot={
          <MobileNavAccountAction locale={locale} dictionary={dictionary} />
        }
      />
      <SiteHeader
        locale={locale}
        currency={currency}
        dictionary={dictionary}
      />
      <main className="storefront-main mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <MaintenanceGate>
          <StorefrontPageAppear>{children}</StorefrontPageAppear>
        </MaintenanceGate>
      </main>
      {/* Footer is desktop-only, so mobile keeps the copyright at the page end. */}
      <SiteCopyright
        dictionary={dictionary}
        className="storefront-mobile-copyright px-4 pt-8 text-center text-xs leading-5 text-neutral-500 sm:px-6 lg:hidden"
        linkClassName="text-neutral-700 underline-offset-2 hover:underline"
        createdByOnNewLine
      />
      <SiteFooter dictionary={dictionary} locale={locale} />
      <MobileBottomNavIsland
        locale={locale}
        currency={currency}
        dictionary={dictionary}
      />
    </div>
  );
}
