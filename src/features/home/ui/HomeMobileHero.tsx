import { MotionChip, MotionChipRow } from "@/components/motion/MotionChipRow";
import { Reveal } from "@/components/motion/Reveal";
import { AppLink } from "@/components/ui/AppLink";
import {
  ALL_CATEGORIES_ICON,
  CategoryIcon,
} from "@/features/categories/ui/category-icons";
import { HomeMobileHeroCarousel } from "@/features/home/ui/HomeMobileHeroCarousel";
import { catalogHref } from "@/features/products/domain/catalog-url";
import { DEFAULT_CATALOG_FILTERS } from "@/features/products/schemas/catalog-list";
import type { StorefrontHeroSlide } from "@/features/hero/application/queries";
import type { Locale } from "@/lib/i18n/config";

export type HomeMobileCategoryChip = {
  id: string;
  title: string;
  slug: string;
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
  const AllIcon = ALL_CATEGORIES_ICON;

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
            <AllIcon className="size-5 shrink-0" aria-hidden />
            {allCategoriesLabel}
          </AppLink>
        </MotionChip>

        {categories.map((category) => (
          <MotionChip key={category.id}>
            <AppLink
              href={category.href}
              prefetchPolicy="intent"
              role="listitem"
              className="inline-flex h-[41px] items-center gap-2 rounded-full border border-[rgba(31,31,31,0.26)] bg-white px-5 text-sm text-[#1f1f1f]"
            >
              <CategoryIcon
                slug={category.slug}
                title={category.title}
                className="size-5 shrink-0"
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
