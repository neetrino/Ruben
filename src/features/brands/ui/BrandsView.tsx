import { AppLink } from "@/components/ui/AppLink";
import { STOREFRONT_BRANDS } from "@/features/brands/config/brands";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type BrandsViewProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * Brands page — logo wordmarks only (Figma partners strip style).
 */
export function BrandsView({ locale, dictionary }: BrandsViewProps) {
  const copy = dictionary.brands;
  const productsHref = `/${locale}/products`;

  return (
    <div className="brands-page-root relative z-0 -mx-4 -my-10 bg-white sm:-mx-6 lg:-mx-8">
      <div className="relative z-10 mx-auto flex min-h-[50dvh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h1 className="sr-only">{copy.title}</h1>

        <ul className="flex w-full flex-wrap items-center justify-center gap-x-12 gap-y-10 sm:gap-x-20 lg:gap-x-24 lg:gap-y-14">
          {STOREFRONT_BRANDS.map((brand) => (
            <li key={brand.id} className="flex items-center">
              <AppLink
                href={productsHref}
                prefetchPolicy="intent"
                aria-label={brand.name}
                className="flex h-8 flex-col justify-center text-center text-[28px] leading-none font-bold text-[#111] uppercase transition-opacity hover:opacity-70 sm:h-10 sm:text-[40px] lg:h-14 lg:text-[54px]"
              >
                {brand.name}
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
