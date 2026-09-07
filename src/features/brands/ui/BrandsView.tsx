import { AppLink } from "@/components/ui/AppLink";
import {
  STOREFRONT_BRANDS,
  type StorefrontBrand,
} from "@/features/brands/config/brands";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type BrandsViewProps = {
  locale: Locale;
  dictionary: Dictionary;
};

function brandSummary(brand: StorefrontBrand, locale: Locale): string {
  return brand.summary[locale];
}

/**
 * Brands listing — partner marks with shop CTA (static v1 data).
 */
export function BrandsView({ locale, dictionary }: BrandsViewProps) {
  const copy = dictionary.brands;
  const productsHref = `/${locale}/products`;

  return (
    <div className="brands-page-root relative z-0 -mx-4 -my-10 bg-white sm:-mx-6 lg:-mx-8">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-10 max-w-2xl sm:mb-14">
          <p className="text-xs font-semibold tracking-[0.18em] text-[var(--brand-deep)] uppercase">
            {dictionary.brand}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
            {copy.subtitle}
          </p>
          <div className="mt-5 h-1.5 w-16 rounded-full bg-[var(--brand)]" />
        </header>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {STOREFRONT_BRANDS.map((brand) => (
            <li key={brand.id}>
              <AppLink
                href={productsHref}
                prefetchPolicy="intent"
                className="group flex h-full flex-col rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-[0_12px_40px_-28px_rgba(17,24,39,0.28)] transition-colors hover:border-gray-300 hover:bg-gray-50/60"
              >
                <span className="text-2xl font-black tracking-tight text-gray-900 uppercase sm:text-3xl">
                  {brand.name}
                </span>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                  {brandSummary(brand, locale)}
                </p>
                <span className="mt-6 inline-flex items-center text-sm font-semibold text-gray-900 transition-opacity group-hover:opacity-80">
                  {copy.shopCta}
                  <span aria-hidden className="ml-1.5">
                    →
                  </span>
                </span>
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
