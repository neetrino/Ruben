import Image from "next/image";

import { MotionChip, MotionChipRow } from "@/components/motion/MotionChipRow";
import { Reveal } from "@/components/motion/Reveal";
import { AppLink } from "@/components/ui/AppLink";
import { HOME_MOBILE_ASSETS } from "@/features/home/config/assets";
import { HomeMobileHeroCarousel } from "@/features/home/ui/HomeMobileHeroCarousel";
import { catalogHref } from "@/features/products/domain/catalog-url";
import { DEFAULT_CATALOG_FILTERS } from "@/features/products/schemas/catalog-list";
import { CATALOG_ASSETS } from "@/features/products/ui/catalog-assets";
import type { StorefrontHeroSlide } from "@/features/hero/application/queries";
import type { Locale } from "@/lib/i18n/config";

export type HomeMobileCategoryChip = {
  id: string;
  title: string;
  href: string;
};

type HomeMobileHeroProps = {
  locale: Locale;
  brandName: string;
  slides: StorefrontHeroSlide[];
  categories: readonly HomeMobileCategoryChip[];
  allCategoriesLabel: string;
  prevSlideLabel: string;
  nextSlideLabel: string;
  fallbackImageSrc: string;
};

function chipIconSrc(index: number): string {
  const icons = CATALOG_ASSETS.chipIcons;
  return icons[index % icons.length] ?? HOME_MOBILE_ASSETS.chipBathtub;
}

/**
 * Mobile home hero: category chips + carousel (Figma 171:562).
 * Logo / search chrome lives in {@link StorefrontMobileTopBar}.
 * Shown below `lg`; desktop keeps {@link HomeHero}.
 */
export function HomeMobileHero({
  locale,
  brandName,
  slides,
  categories,
  allCategoriesLabel,
  prevSlideLabel,
  nextSlideLabel,
  fallbackImageSrc,
}: HomeMobileHeroProps) {
  const allHref = catalogHref(locale, DEFAULT_CATALOG_FILTERS, {
    category: undefined,
    page: 1,
  });

  return (
    <section className="relative bg-white px-[14px] pt-5 pb-6 tablet:pb-2 lg:hidden">
      <MotionChipRow
        className="flex gap-3 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label={allCategoriesLabel}
      >
        <MotionChip>
          <AppLink
            href={allHref}
            prefetchPolicy="intent"
            role="listitem"
            className="inline-flex h-[41px] items-center gap-2 rounded-full bg-[var(--brand)] px-5 text-sm font-semibold text-[#1f1f1f]"
          >
            <Image
              src={HOME_MOBILE_ASSETS.menuAll}
              alt=""
              width={20}
              height={20}
              className="size-5"
              aria-hidden
            />
            {allCategoriesLabel}
          </AppLink>
        </MotionChip>

        {categories.map((category, index) => (
          <MotionChip key={category.id}>
            <AppLink
              href={category.href}
              prefetchPolicy="intent"
              role="listitem"
              className="inline-flex h-[41px] items-center gap-2 rounded-full border border-[rgba(31,31,31,0.26)] bg-white px-5 text-sm text-[#1f1f1f]"
            >
              <Image
                src={chipIconSrc(index)}
                alt=""
                width={20}
                height={20}
                className="size-5"
                aria-hidden
              />
              {category.title}
            </AppLink>
          </MotionChip>
        ))}
      </MotionChipRow>

      <Reveal>
        <HomeMobileHeroCarousel
          brandName={brandName}
          slides={slides}
          prevSlideLabel={prevSlideLabel}
          nextSlideLabel={nextSlideLabel}
          fallbackImageSrc={fallbackImageSrc}
        />
      </Reveal>
    </section>
  );
}
