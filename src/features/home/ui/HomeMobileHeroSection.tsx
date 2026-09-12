import { listStorefrontCategories } from "@/features/home/application/list-storefront-categories";
import { HOME_ASSETS } from "@/features/home/config/assets";
import { HomeMobileHero } from "@/features/home/ui/HomeMobileHero";
import type { StorefrontHeroSlide } from "@/features/hero/application/queries";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type HomeMobileHeroSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
  slides: StorefrontHeroSlide[];
};

/** Streams category chips into the mobile home hero without blocking the page shell. */
export async function HomeMobileHeroSection({
  locale,
  dictionary,
  slides,
}: HomeMobileHeroSectionProps) {
  const categories = await listStorefrontCategories(locale);
  const productsHref = `/${locale}/products`;

  return (
    <HomeMobileHero
      locale={locale}
      brandName={dictionary.brand}
      slides={slides}
      categories={categories
        .filter((category) => category.parentId === null)
        .map((category) => ({
          id: category.id,
          title: category.title,
          slug: category.slug,
          href: `${productsHref}?category=${encodeURIComponent(category.slug)}`,
        }))}
      allCategoriesLabel={dictionary.catalog.allChip}
      fallbackImageSrc={HOME_ASSETS.heroProduct}
    />
  );
}
