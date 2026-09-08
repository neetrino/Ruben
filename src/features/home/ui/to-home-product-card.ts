import type { Locale } from "@/lib/i18n/config";

type SourceProduct = {
  id: string;
  priceAmount: number;
  compareAtAmount: number | null;
  discountPercent: number | null;
  imageUrl: string | null;
  stockOnHand: number;
  translation: { slug: string; title: string };
};

type FormatPrice = (amount: number) => { formatted: string };

export type HomeProductCardModel = {
  id: string;
  href: string;
  title: string;
  brandLabel: string | null;
  categoryLabel: string | null;
  priceFormatted: string;
  compareAtFormatted: string | null;
  discountPercent: number | null;
  imageUrl: string | null;
  inStock: boolean;
  inWishlist: boolean;
  inCompare: boolean;
};

type ToHomeProductCardInput = {
  product: SourceProduct;
  locale: Locale;
  formatPrice: FormatPrice;
  /** Meta line above the card title; null hides it. */
  categoryLabel: string | null;
  wishlistIds: ReadonlySet<string>;
  compareIds: ReadonlySet<string>;
};

export function toHomeProductCard({
  product,
  locale,
  formatPrice,
  categoryLabel,
  wishlistIds,
  compareIds,
}: ToHomeProductCardInput): HomeProductCardModel {
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
    categoryLabel,
    priceFormatted: price.formatted,
    compareAtFormatted: compareAt?.formatted ?? null,
    discountPercent: product.discountPercent,
    imageUrl: product.imageUrl,
    inStock: product.stockOnHand > 0,
    inWishlist: wishlistIds.has(product.id),
    inCompare: compareIds.has(product.id),
  };
}
