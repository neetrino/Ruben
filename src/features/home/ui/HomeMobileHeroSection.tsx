import { listStorefrontCategories } from "@/features/home/application/list-storefront-categories";
import { HOME_ASSETS } from "@/features/home/config/assets";
import { HomeMobileHero } from "@/features/home/ui/HomeMobileHero";
import type { StorefrontHeroSlide } from "@/features/hero/application/queries";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { resolveExistingPublicMediaUrl } from "@/lib/media/resolve-public-media-url";

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
  const phoneDigits = dictionary.contact.storePhone.replace(/\s/g, "");
  const mapsQuery = encodeURIComponent(dictionary.contact.storeAddress);

  // Drop missing local `/uploads/...` files so Next/Image does not 404.
  const slidesWithExistingMedia = slides.map((slide) => ({
    ...slide,
    mobileImageUrl: resolveExistingPublicMediaUrl(slide.mobileImageUrl),
    desktopImageUrl: resolveExistingPublicMediaUrl(slide.desktopImageUrl),
  }));

  return (
    <HomeMobileHero
      locale={locale}
      brandName={dictionary.brand}
      slides={slidesWithExistingMedia}
      categories={categories.map((category) => ({
        id: category.id,
        title: category.title,
        href: `${productsHref}?category=${encodeURIComponent(category.slug)}`,
      }))}
      allCategoriesLabel={dictionary.catalog.allChip}
      searchPlaceholder={dictionary.header.searchPlaceholder}
      searchSubmitLabel={dictionary.header.search}
      filtersLabel={dictionary.catalog.filtersTitle}
      locationLabel={dictionary.contact.mapTitle}
      callLabel={dictionary.contact.callTitle}
      phoneHref={`tel:${phoneDigits}`}
      locationHref={`https://maps.google.com/?q=${mapsQuery}`}
      prevSlideLabel={dictionary.home.categoriesPrev}
      nextSlideLabel={dictionary.home.categoriesNext}
      fallbackImageSrc={HOME_ASSETS.heroProduct}
    />
  );
}
