import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import { AddToCartButton } from "@/features/cart/ui/AddToCartButton";
import { CompareButton } from "@/features/compare/ui/CompareButton";
import { WishlistButton } from "@/features/wishlist/ui/WishlistButton";
import type { Locale } from "@/lib/i18n/config";

type ProductCardProps = {
  href: string;
  title: string;
  priceFormatted: string;
  compareAtFormatted?: string | null;
  discountPercent?: number | null;
  imageUrl: string | null;
  inStock: boolean;
  /** Primary category title (CAT-007). */
  categoryLabel?: string | null;
  /** Short technical summary from product description. */
  specsSummary?: string | null;
  /** Localized badge text when present. */
  badgeLabel?: string | null;
  priority?: boolean;
  locale?: Locale;
  productId?: string;
  inWishlist?: boolean;
  inCompare?: boolean;
  isSignedIn?: boolean;
  wishlistLabel?: string;
  compareLabel?: string;
  compareLimitLabel?: string;
  addToCartLabel?: string;
  outOfStockLabel?: string;
};

export function ProductCard({
  href,
  title,
  priceFormatted,
  compareAtFormatted = null,
  discountPercent = null,
  imageUrl,
  inStock,
  categoryLabel = null,
  specsSummary = null,
  badgeLabel = null,
  priority = false,
  locale,
  productId,
  inWishlist = false,
  inCompare = false,
  isSignedIn = false,
  wishlistLabel,
  compareLabel,
  compareLimitLabel,
  addToCartLabel,
  outOfStockLabel = "Out of stock",
}: ProductCardProps) {
  const onSale = Boolean(compareAtFormatted);
  const showWishlist =
    locale != null && productId != null && wishlistLabel != null;
  const showCompare =
    locale != null && productId != null && compareLabel != null;
  const showAddToCart = productId != null && addToCartLabel != null;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-transparent">
        <AppLink
          href={href}
          prefetchPolicy={priority ? "intent" : "auto"}
          className="absolute inset-0 block"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
              No image
            </div>
          )}
        </AppLink>

        {showWishlist || showCompare ? (
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {showWishlist ? (
              <WishlistButton
                locale={locale}
                productId={productId}
                initialInWishlist={inWishlist}
                isSignedIn={isSignedIn}
                label={wishlistLabel}
                size="sm"
                className="h-9 w-9 bg-white/90 text-gray-800 shadow-sm hover:bg-white"
              />
            ) : null}
            {showCompare ? (
              <CompareButton
                locale={locale}
                productId={productId}
                initialInCompare={inCompare}
                isSignedIn={isSignedIn}
                label={compareLabel}
                limitReachedLabel={compareLimitLabel}
                size="sm"
                className="h-9 w-9 bg-white/90 text-gray-800 shadow-sm hover:bg-white"
              />
            ) : null}
          </div>
        ) : null}

        {badgeLabel ? (
          <span className="absolute top-3 right-3 z-10 max-w-[70%] truncate rounded bg-gray-900/90 px-2 py-1 text-xs font-semibold text-white">
            {badgeLabel}
          </span>
        ) : discountPercent != null ? (
          <span className="absolute top-3 right-3 z-10 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
            -{discountPercent}%
          </span>
        ) : null}

        {showAddToCart ? (
          <AddToCartButton
            productId={productId}
            label={addToCartLabel}
            disabled={!inStock}
            size="sm"
            className="absolute right-3 bottom-3 z-10 h-9 w-9 bg-white/90 text-gray-800 shadow-sm hover:bg-white"
          />
        ) : null}

        {!inStock ? (
          <span className="absolute bottom-3 left-3 z-10 rounded bg-gray-900/90 px-2 py-1 text-xs font-semibold text-white">
            {outOfStockLabel}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1 p-4">
        {categoryLabel ? (
          <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            {categoryLabel}
          </p>
        ) : null}
        <h3 className="line-clamp-2 text-base font-medium text-gray-900">
          <AppLink
            href={href}
            prefetchPolicy={priority ? "intent" : "auto"}
            className="hover:underline"
          >
            {title}
          </AppLink>
        </h3>
        {specsSummary ? (
          <p className="line-clamp-2 text-sm text-gray-600">{specsSummary}</p>
        ) : null}
        <div className="mt-1 flex flex-wrap items-baseline gap-2">
          <p className="text-lg font-semibold text-gray-900">{priceFormatted}</p>
          {onSale ? (
            <p className="text-sm text-gray-500 line-through">
              {compareAtFormatted}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
