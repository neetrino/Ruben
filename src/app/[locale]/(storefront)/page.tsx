import { notFound } from "next/navigation";

import { listActiveHeroSlides } from "@/features/hero/application/queries";
import { listStorefrontCategories } from "@/features/home/application/list-storefront-categories";
import { HomeCategories } from "@/features/home/ui/HomeCategories";
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
  brandLabel: string | null;
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
    categories,
    globalDiscount,
    currency,
    user,
  ] = await Promise.all([
    listActiveHeroSlides(locale),
    getFeaturedProducts(locale),
    getOnSaleProducts(locale),
    listStorefrontCategories(locale),
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
      brandLabel: null,
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

  const categoryCards = categories.map((category) => ({
    id: category.id,
    title: category.title,
    href: `${productsHref}?category=${encodeURIComponent(category.slug)}`,
    imageUrl: category.imageUrl,
  }));

  return (
    <div className="home-page-root relative bg-white">
      <HomeHero
        slides={heroSlides}
        brandName={dictionary.home.title}
        fallbackSubtitle={dictionary.home.subtitle}
        fallbackCtaLabel={dictionary.home.cta}
        fallbackCtaHref={productsHref}
      />

      <HomeCategories
        categories={categoryCards}
        emptyLabel={dictionary.home.categoriesEmpty}
        prevLabel={dictionary.home.categoriesPrev}
        nextLabel={dictionary.home.categoriesNext}
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
      />

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

      <HomePartners title={dictionary.home.partnersTitle} />
    </div>
  );
}
