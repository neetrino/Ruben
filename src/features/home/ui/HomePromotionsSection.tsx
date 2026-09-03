import { getCompareProductIds } from "@/features/compare/queries";
import { HomePromotions } from "@/features/home/ui/HomePromotions";
import { toHomeProductCard } from "@/features/home/ui/to-home-product-card";
import { getOnSaleProducts } from "@/features/products/queries";
import { getStoreGlobalDiscount } from "@/features/settings/application/queries";
import { getWishlistProductIds } from "@/features/wishlist/queries";
import { getCurrentUser } from "@/lib/auth/session";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import {
  createDisplayPriceFormatter,
  getSelectedCurrency,
} from "@/lib/money/display-price";

type HomePromotionsSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/** Streams promotions rail independently of featured products. */
export async function HomePromotionsSection({
  locale,
  dictionary,
}: HomePromotionsSectionProps) {
  const [onSaleProducts, globalDiscount, currency, user] = await Promise.all([
    getOnSaleProducts(locale),
    getStoreGlobalDiscount(),
    getSelectedCurrency(),
    getCurrentUser(),
  ]);

  const productIds = onSaleProducts.map((product) => product.id);
  const [wishlistIds, compareIds, formatPrice] = await Promise.all([
    getWishlistProductIds(productIds),
    getCompareProductIds(productIds),
    createDisplayPriceFormatter(locale, currency),
  ]);

  const products = onSaleProducts.map((product) =>
    toHomeProductCard(product, locale, formatPrice, wishlistIds, compareIds),
  );

  const globalDiscountLabel =
    globalDiscount.percentage != null
      ? dictionary.home.globalDiscountLabel.replace(
          "{percent}",
          String(globalDiscount.percentage),
        )
      : null;

  return (
    <HomePromotions
      locale={locale}
      title={dictionary.home.promotionsTitle}
      viewAllLabel={dictionary.home.viewAll}
      viewAllHref={`/${locale}/products`}
      emptyLabel={dictionary.home.emptyPromotions}
      globalDiscountLabel={globalDiscountLabel}
      wishlistLabel={dictionary.nav.wishlist}
      compareLabel={dictionary.nav.compare}
      compareLimitLabel={dictionary.compare.limitReached}
      addToCartLabel={dictionary.product.addToCart}
      isSignedIn={Boolean(user)}
      products={products}
    />
  );
}
