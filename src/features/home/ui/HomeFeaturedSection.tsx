import { getCompareProductIds } from "@/features/compare/queries";
import { HomeFeaturedProducts } from "@/features/home/ui/HomeFeaturedProducts";
import { toHomeProductCard } from "@/features/home/ui/to-home-product-card";
import { getFeaturedProducts } from "@/features/products/queries";
import { getWishlistProductIds } from "@/features/wishlist/queries";
import { getCurrentUser } from "@/lib/auth/session";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import {
  createDisplayPriceFormatter,
  getSelectedCurrency,
} from "@/lib/money/display-price";

type HomeFeaturedSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/** Streams the featured product rail without blocking hero HTML. */
export async function HomeFeaturedSection({
  locale,
  dictionary,
}: HomeFeaturedSectionProps) {
  const [featuredProducts, currency, user] = await Promise.all([
    getFeaturedProducts(locale),
    getSelectedCurrency(),
    getCurrentUser(),
  ]);

  const productIds = featuredProducts.map((product) => product.id);
  const [wishlistIds, compareIds, formatPrice] = await Promise.all([
    getWishlistProductIds(productIds),
    getCompareProductIds(productIds),
    createDisplayPriceFormatter(locale, currency),
  ]);

  const products = featuredProducts.map((product) =>
    toHomeProductCard(product, locale, formatPrice, wishlistIds, compareIds),
  );

  return (
    <HomeFeaturedProducts
      locale={locale}
      title={dictionary.home.featuredTitle}
      viewAllLabel={dictionary.home.viewAll}
      viewAllHref={`/${locale}/products`}
      emptyLabel={dictionary.home.emptyFeatured}
      wishlistLabel={dictionary.nav.wishlist}
      compareLabel={dictionary.nav.compare}
      compareLimitLabel={dictionary.compare.limitReached}
      addToCartLabel={dictionary.product.addToCart}
      isSignedIn={Boolean(user)}
      products={products}
    />
  );
}
