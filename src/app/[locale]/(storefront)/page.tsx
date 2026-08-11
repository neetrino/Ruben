import { notFound } from "next/navigation";

import { listActiveHeroSlides } from "@/features/hero/application/queries";
import { HomeAboutTeaser } from "@/features/home/ui/HomeAboutTeaser";
import { HomeFeaturedProducts } from "@/features/home/ui/HomeFeaturedProducts";
import { HomeFeatures } from "@/features/home/ui/HomeFeatures";
import { HomeHero } from "@/features/home/ui/HomeHero";
import { HomePartners } from "@/features/home/ui/HomePartners";
import { HomePromotions } from "@/features/home/ui/HomePromotions";
import {
  getFeaturedProducts,
  getOnSaleProducts,
} from "@/features/products/queries";
import { getStoreGlobalDiscount } from "@/features/settings/application/queries";
import { getCompareProductIds } from "@/features/compare/queries";
import { getWishlistProductIds } from "@/features/wishlist/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  createDisplayPriceFormatter,
  getSelectedCurrency,
} from "@/lib/money/display-price";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

type PricedCard = {
  id: string;
  href: string;
  title: string;
  priceFormatted: string;
  compareAtFormatted: string | null;
  discountPercent: number | null;
  imageUrl: string | null;
  inStock: boolean;
  inWishlist: boolean;
  inCompare: boolean;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);
  const [
    heroSlides,
    featuredProducts,
    onSaleProducts,
    globalDiscount,
    currency,
    user,
  ] = await Promise.all([
    listActiveHeroSlides(locale),
    getFeaturedProducts(locale),
    getOnSaleProducts(locale),
    getStoreGlobalDiscount(),
    getSelectedCurrency(),
    getCurrentUser(),
  ]);

  const productIds = [
    ...new Set([
      ...featuredProducts.map((product) => product.id),
      ...onSaleProducts.map((product) => product.id),
    ]),
  ];

  const [wishlistIds, compareIds, formatPrice] = await Promise.all([
    getWishlistProductIds(productIds),
    getCompareProductIds(productIds),
    createDisplayPriceFormatter(locale, currency),
  ]);

  function toCard(
    product: (typeof featuredProducts)[number],
  ): PricedCard {
    const price = formatPrice(product.priceAmount);
    const compareAt =
      product.compareAtAmount != null
        ? formatPrice(product.compareAtAmount)
        : null;

    return {
      id: product.id,
      href: `/${locale}/products/${product.translation.slug}`,
      title: product.translation.title,
      priceFormatted: price.formatted,
      compareAtFormatted: compareAt?.formatted ?? null,
      discountPercent: product.discountPercent,
      imageUrl: product.imageUrl,
      inStock: product.stockOnHand > 0,
      inWishlist: wishlistIds.has(product.id),
      inCompare: compareIds.has(product.id),
    };
  }

  const featuredCards = featuredProducts.map(toCard);
  const promoCards = onSaleProducts.map(toCard);
  const productsHref = `/${locale}/products`;
  const globalDiscountLabel =
    globalDiscount.percentage != null
      ? dictionary.home.globalDiscountLabel.replace(
          "{percent}",
          String(globalDiscount.percentage),
        )
      : null;

  return (
    <div className="-mx-4 -my-10 sm:-mx-6 lg:-mx-8">
      <HomeHero
        slides={heroSlides}
        fallbackTitle={dictionary.home.title}
        fallbackSubtitle={dictionary.home.subtitle}
        fallbackCtaLabel={dictionary.home.cta}
        fallbackCtaHref={productsHref}
      />

      <HomeFeaturedProducts
        locale={locale}
        title={dictionary.home.featuredTitle}
        viewAllLabel={dictionary.home.viewAll}
        viewAllHref={productsHref}
        emptyLabel={dictionary.home.emptyFeatured}
        wishlistLabel={dictionary.nav.wishlist}
        compareLabel={dictionary.nav.compare}
        compareLimitLabel={dictionary.compare.limitReached}
        addToCartLabel={dictionary.product.addToCart}
        isSignedIn={Boolean(user)}
        products={featuredCards}
      />

      <HomePromotions
        locale={locale}
        title={dictionary.home.promotionsTitle}
        subtitle={dictionary.home.promotionsSubtitle}
        viewAllLabel={dictionary.home.viewAll}
        viewAllHref={productsHref}
        emptyLabel={dictionary.home.emptyPromotions}
        globalDiscountLabel={globalDiscountLabel}
        wishlistLabel={dictionary.nav.wishlist}
        compareLabel={dictionary.nav.compare}
        compareLimitLabel={dictionary.compare.limitReached}
        addToCartLabel={dictionary.product.addToCart}
        isSignedIn={Boolean(user)}
        products={promoCards}
        offers={[
          {
            title: dictionary.home.offers.saleTitle,
            description: dictionary.home.offers.saleDescription,
            href: productsHref,
          },
          {
            title: dictionary.home.offers.installmentTitle,
            description: dictionary.home.offers.installmentDescription,
            href: productsHref,
          },
          {
            title: dictionary.home.offers.deliveryTitle,
            description: dictionary.home.offers.deliveryDescription,
            href: `/${locale}/contact`,
          },
        ]}
      />

      <HomeFeatures
        title={dictionary.home.whyTitle}
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

      <HomePartners
        title={dictionary.home.partnersTitle}
        subtitle={dictionary.home.partnersSubtitle}
      />

      <HomeAboutTeaser
        eyebrow={dictionary.home.aboutEyebrow}
        title={dictionary.home.aboutTitle}
        description={dictionary.home.aboutDescription}
        ctaLabel={dictionary.home.aboutCta}
        ctaHref={`/${locale}/about`}
      />
    </div>
  );
}
