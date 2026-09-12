import Image from "next/image";

import { STOREFRONT_PAGE_TITLE_CLASS } from "@/components/layout/storefront-page-title";
import { HOVER_LIFT_CLASS } from "@/components/motion/motion-classes";
import { Reveal } from "@/components/motion/Reveal";
import { RevealItem, RevealList } from "@/components/motion/RevealList";
import { AppLink } from "@/components/ui/AppLink";
import type { StorefrontBrandItem } from "@/features/brands/application/list-storefront-brands";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type BrandsViewProps = {
  locale: Locale;
  dictionary: Dictionary;
  brands: readonly StorefrontBrandItem[];
};

/**
 * Brands page — tiles synced from admin CMS brands (empty when none published).
 */
export function BrandsView({ locale, dictionary, brands }: BrandsViewProps) {
  const copy = dictionary.brands;
  const productsHref = `/${locale}/products`;

  return (
    <div className="brands-page-root relative z-0 -mx-4 -mt-10 bg-white sm:-mx-6 lg:-mx-8 lg:-mb-10">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Reveal as="header" className="mb-6 max-w-2xl sm:mb-8">
          <h1 className={STOREFRONT_PAGE_TITLE_CLASS}>{copy.title}</h1>
        </Reveal>

        {brands.length === 0 ? (
          <p className="text-sm text-neutral-500 sm:text-base">{copy.empty}</p>
        ) : (
          <RevealList
            as="ul"
            className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4 lg:gap-6"
          >
            {brands.map((brand) => (
              <RevealItem as="li" key={brand.id}>
                <AppLink
                  href={productsHref}
                  prefetchPolicy="intent"
                  aria-label={brand.title}
                  className={`flex aspect-[16/8] w-full items-center justify-center rounded-[24px] border border-gray-200/80 bg-[#f7f7f7] px-4 text-center transition-colors hover:border-gray-300 hover:bg-gray-100 ${HOVER_LIFT_CLASS}`}
                >
                  {brand.imageUrl ? (
                    <Image
                      src={brand.imageUrl}
                      alt=""
                      width={160}
                      height={64}
                      className="max-h-12 w-auto object-contain sm:max-h-14"
                    />
                  ) : (
                    <span className="text-base leading-none font-bold tracking-tight text-[#111] uppercase sm:text-xl lg:text-2xl">
                      {brand.title}
                    </span>
                  )}
                </AppLink>
              </RevealItem>
            ))}
          </RevealList>
        )}
      </div>
    </div>
  );
}
