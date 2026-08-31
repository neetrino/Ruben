import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import {
  ProductCardPlusIcon,
  ProductCardStarIcon,
} from "@/components/icons/product-card-icons";
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
  /** Brand name shown above the title when available. */
  brandLabel?: string | null;
  /** Fallback for the brand slot (e.g. primary category). */
  categoryLabel?: string | null;
  /** Localized badge text when present (e.g. ԹՈՓ). */
  badgeLabel?: string | null;
  /** Preformatted rating, e.g. "(4,9)". */
  ratingFormatted?: string | null;
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
  brandLabel = null,
  categoryLabel = null,
  badgeLabel = null,
  ratingFormatted = null,
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
  const metaLabel = brandLabel ?? categoryLabel;
  const showWishlist =
    locale != null && productId != null && wishlistLabel != null;
  const showCompare =
    locale != null && productId != null && compareLabel != null;
  const showAddToCart = productId != null && addToCartLabel != null;

  return (
    <article className="relative mx-auto w-full max-w-[318px]">
      <div className="relative mx-auto h-[280px] w-[88%] overflow-visible rounded-[60px] bg-[#eaeaea] sm:h-[320px] lg:h-[379px]">
        <AppLink
          href={href}
          prefetchPolicy={priority ? "intent" : "auto"}
          className="absolute inset-0 block overflow-hidden rounded-[60px]"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
              priority={priority}
              className="object-contain p-6"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              No image
            </div>
          )}
        </AppLink>

        {showWishlist || showCompare || discountPercent != null || badgeLabel ? (
          <div className="absolute top-2 right-[-10px] z-10 flex w-[47px] flex-col items-end gap-[5px]">
            {showWishlist ? (
              <WishlistButton
                locale={locale}
                productId={productId}
                initialInWishlist={inWishlist}
                isSignedIn={isSignedIn}
                label={wishlistLabel}
                size="sm"
                iconVariant="productCard"
                className="h-12 w-12 bg-white/90 text-neutral-800 shadow-[0_1px_6px_rgba(0,0,0,0.25)] backdrop-blur-sm hover:bg-white"
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
                iconVariant="productCard"
                className="h-12 w-12 bg-white/45 text-neutral-800 shadow-[0_1px_6px_rgba(0,0,0,0.25)] backdrop-blur-[4px] hover:bg-white/70"
              />
            ) : null}
            {discountPercent != null ? (
              <span className="inline-flex h-[23px] w-full items-center justify-center rounded-full bg-[var(--brand)] text-[10px] font-bold text-white">
                -{discountPercent}%
              </span>
            ) : null}
            {badgeLabel ? (
              <span className="inline-flex h-[23px] w-full items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white uppercase">
                {badgeLabel}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="relative z-10 -mt-28 min-h-[147px] rounded-[40px] bg-[rgba(131,131,131,0.11)] px-5 pt-[22px] pb-4 backdrop-blur-[2px] sm:-mt-32">
        {metaLabel ? (
          <p className="text-[10px] leading-[15px] tracking-[1px] text-[#4c4546] uppercase">
            {metaLabel}
          </p>
        ) : null}

        <h3 className="mt-1 line-clamp-2 text-base leading-[21px] font-bold text-black uppercase">
          <AppLink
            href={href}
            prefetchPolicy={priority ? "intent" : "auto"}
            className="hover:underline"
          >
            {title}
          </AppLink>
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <p className="text-lg font-black text-black">{priceFormatted}</p>
          {compareAtFormatted ? (
            <p className="text-sm text-black/60 line-through">
              {compareAtFormatted}
            </p>
          ) : null}
        </div>

        <div className="mt-3 flex min-h-12 items-end justify-between gap-3">
          <div className="flex min-h-4 items-center gap-1">
            {!inStock ? (
              <span className="text-xs font-semibold text-neutral-600">
                {outOfStockLabel}
              </span>
            ) : ratingFormatted ? (
              <>
                <ProductCardStarIcon className="h-[15px] w-4 text-black" />
                <span className="text-sm leading-[15px] text-[#575757]">
                  {ratingFormatted}
                </span>
              </>
            ) : null}
          </div>

          {showAddToCart ? (
            <AddToCartButton
              productId={productId}
              label={addToCartLabel}
              disabled={!inStock}
              size="sm"
              imageUrl={imageUrl}
              className="h-12 w-12 shrink-0 bg-black text-white shadow-[0_2px_5px_rgba(0,0,0,0.25)] hover:bg-neutral-800"
            >
              <ProductCardPlusIcon className="h-[18px] w-[18px] text-white" />
            </AddToCartButton>
          ) : null}
        </div>
      </div>
    </article>
  );
}
