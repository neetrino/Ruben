import { ProductCard } from "@/features/products/ui/ProductCard";
import { getRelatedProducts } from "@/features/products/queries";
import { getCompareProductIds } from "@/features/compare/queries";
import { getWishlistProductIds } from "@/features/wishlist/queries";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { createDisplayPriceFormatter } from "@/lib/money/display-price";
import type { Currency } from "@/lib/money/currency";

type ProductRelatedSectionProps = {
  locale: Locale;
  productId: string;
  currency: Currency;
  isSignedIn: boolean;
  dictionary: Dictionary;
};

/** Streams below the PDP fold — does not block gallery/purchase chrome. */
export async function ProductRelatedSection({
  locale,
  productId,
  currency,
  isSignedIn,
  dictionary,
}: ProductRelatedSectionProps) {
  const related = await getRelatedProducts(locale, productId);
  if (related.length === 0) {
    return null;
  }

  const relatedIds = related.map((item) => item.id);
  const [wishlistIds, compareIds, formatPrice] = await Promise.all([
    getWishlistProductIds(relatedIds),
    getCompareProductIds(relatedIds),
    createDisplayPriceFormatter(locale, currency),
  ]);

  const labels = dictionary.product;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-gray-900">{labels.related}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((item) => {
          const price = formatPrice(item.priceAmount);
          const compareAt =
            item.compareAtAmount != null
              ? formatPrice(item.compareAtAmount)
              : null;

          return (
            <ProductCard
              key={item.id}
              href={`/${locale}/products/${item.translation.slug}`}
              title={item.translation.title}
              priceFormatted={price.formatted}
              compareAtFormatted={compareAt?.formatted ?? null}
              discountPercent={item.discountPercent}
              imageUrl={item.imageUrl}
              inStock={item.stockOnHand > 0}
              locale={locale}
              productId={item.id}
              inWishlist={wishlistIds.has(item.id)}
              inCompare={compareIds.has(item.id)}
              isSignedIn={isSignedIn}
              wishlistLabel={dictionary.nav.wishlist}
              compareLabel={dictionary.nav.compare}
              compareLimitLabel={dictionary.compare.limitReached}
              addToCartLabel={labels.addToCart}
            />
          );
        })}
      </div>
    </section>
  );
}
