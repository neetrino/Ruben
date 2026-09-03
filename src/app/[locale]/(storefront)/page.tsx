import { Suspense } from "react";
import { notFound } from "next/navigation";

import { LazyWhenVisible } from "@/components/loading/LazyWhenVisible";
import {
  HomeCategoriesSkeleton,
  HomeFeaturesSkeleton,
  HomeProductRailSkeleton,
} from "@/components/loading/storefront-skeletons";
import { listActiveHeroSlides } from "@/features/hero/application/queries";
import { HomeCategoriesSection } from "@/features/home/ui/HomeCategoriesSection";
import { HomeFeaturedSection } from "@/features/home/ui/HomeFeaturedSection";
import { HomeFeatures } from "@/features/home/ui/HomeFeatures";
import { HomeHero } from "@/features/home/ui/HomeHero";
import { HomePartners } from "@/features/home/ui/HomePartners";
import { HomePromotionsSection } from "@/features/home/ui/HomePromotionsSection";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);
  const productsHref = `/${locale}/products`;

  // Critical path only — below-fold rails stream via Suspense.
  const heroSlides = await listActiveHeroSlides(locale);

  return (
    <div className="home-page-root relative bg-white">
      <HomeHero
        slides={heroSlides}
        brandName={dictionary.home.title}
        fallbackSubtitle={dictionary.home.subtitle}
        fallbackCtaLabel={dictionary.home.cta}
        fallbackCtaHref={productsHref}
      />

      <Suspense fallback={<HomeCategoriesSkeleton />}>
        <HomeCategoriesSection locale={locale} dictionary={dictionary} />
      </Suspense>

      <Suspense fallback={<HomeProductRailSkeleton />}>
        <HomeFeaturedSection locale={locale} dictionary={dictionary} />
      </Suspense>

      <Suspense fallback={<HomeProductRailSkeleton />}>
        <HomePromotionsSection locale={locale} dictionary={dictionary} />
      </Suspense>

      <LazyWhenVisible fallback={<HomeFeaturesSkeleton />}>
        <HomeFeatures
          items={[
            {
              icon: "warranty",
              title: dictionary.home.features.warrantyTitle,
              description: dictionary.home.features.warrantyDescription,
            },
            {
              icon: "delivery",
              title: dictionary.home.features.deliveryTitle,
              description: dictionary.home.features.deliveryDescription,
            },
            {
              icon: "installment",
              title: dictionary.home.features.installmentTitle,
              description: dictionary.home.features.installmentDescription,
            },
            {
              icon: "original",
              title: dictionary.home.features.originalTitle,
              description: dictionary.home.features.originalDescription,
            },
          ]}
        />
      </LazyWhenVisible>

      <HomePartners title={dictionary.home.partnersTitle} />
    </div>
  );
}
