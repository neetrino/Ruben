import { STOREFRONT_PAGE_TITLE_CLASS } from "@/components/layout/storefront-page-title";
import { HOVER_LIFT_CLASS } from "@/components/motion/motion-classes";
import { Reveal } from "@/components/motion/Reveal";
import { RevealItem, RevealList } from "@/components/motion/RevealList";
import { AppLink } from "@/components/ui/AppLink";
import { STOREFRONT_BRANDS } from "@/features/brands/config/brands";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type BrandsViewProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * Brands page — title + logo wordmarks in rectangular tiles.
 */
export function BrandsView({ locale, dictionary }: BrandsViewProps) {
  const copy = dictionary.brands;
  const productsHref = `/${locale}/products`;

  return (
    <div className="brands-page-root relative z-0 -mx-4 -mt-10 bg-white sm:-mx-6 lg:-mx-8 lg:-mb-10">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Reveal as="header" className="mb-6 max-w-2xl sm:mb-8">
          <h1 className={STOREFRONT_PAGE_TITLE_CLASS}>{copy.title}</h1>
        </Reveal>

        <RevealList
          as="ul"
          className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4 lg:gap-6"
        >
          {STOREFRONT_BRANDS.map((brand) => (
            <RevealItem as="li" key={brand.id}>
              <AppLink
                href={productsHref}
                prefetchPolicy="intent"
                aria-label={brand.name}
                className={`flex aspect-[16/8] w-full items-center justify-center rounded-[24px] border border-gray-200/80 bg-[#f7f7f7] px-4 text-center transition-colors hover:border-gray-300 hover:bg-gray-100 ${HOVER_LIFT_CLASS}`}
              >
                <span className="text-base leading-none font-bold tracking-tight text-[#111] uppercase sm:text-xl lg:text-2xl">
                  {brand.name}
                </span>
              </AppLink>
            </RevealItem>
          ))}
        </RevealList>
      </div>
    </div>
  );
}
