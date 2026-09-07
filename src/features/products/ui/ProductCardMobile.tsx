import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import { AddToCartButton } from "@/features/cart/ui/AddToCartButton";
import { CompareButton } from "@/features/compare/ui/CompareButton";
import { HOME_MOBILE_ASSETS } from "@/features/home/config/assets";
import { WishlistButton } from "@/features/wishlist/ui/WishlistButton";
import type { Locale } from "@/lib/i18n/config";

type ProductCardMobileProps = {
  href: string;
  title: string;
  priceFormatted: string;
  compareAtFormatted?: string | null;
  discountPercent?: number | null;
  badgeLabel?: string | null;
  imageUrl: string | null;
  inStock: boolean;
  brandLabel?: string | null;
  categoryLabel?: string | null;
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
  /** Optional storefront rating label (e.g. "4.5"). Omitted when null. */
  ratingLabel?: string | null;
};

/**
 * Mobile product card matching Figma Home card (171:368 / 171:373).
 * Glass info panel overlaps a rounded product image; cart sits bottom-right.
 */
export function ProductCardMobile({
  href,
  title,
  priceFormatted,
  compareAtFormatted = null,
  discountPercent = null,
  badgeLabel = null,
  imageUrl,
  inStock,
  brandLabel = null,
  categoryLabel = null,
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
  ratingLabel = null,
}: ProductCardMobileProps) {
  const metaLabel = brandLabel ?? categoryLabel;
  const showAddToCart = productId != null && addToCartLabel != null;
  const showWishlist =
    locale != null && productId != null && wishlistLabel != null;
  const showCompare =
    locale != null && productId != null && compareLabel != null;

  return (
    <article className="relative mx-auto flex h-full w-full max-w-[186px] flex-col tablet:max-w-none">
      <div className="relative mx-auto w-[91%] overflow-visible rounded-[24px] bg-[#eaeaea]">
        <AppLink
          href={href}
          prefetchPolicy={priority ? "intent" : "auto"}
          className="relative block aspect-[169/181] w-full overflow-hidden rounded-[24px]"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 743px) 45vw, (max-width: 1024px) 240px, 170px"
              priority={priority}
              className="object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[160px] items-center justify-center text-xs text-neutral-400">
              No image
            </div>
          )}
        </AppLink>

        {discountPercent != null || badgeLabel ? (
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {discountPercent != null ? (
              <span className="inline-flex h-[22px] items-center justify-center rounded-full bg-[var(--brand)] px-2 text-[10px] font-bold text-black">
                -{discountPercent}%
              </span>
            ) : null}
            {badgeLabel ? (
              <span className="inline-flex h-[22px] items-center justify-center rounded-full bg-black px-2 text-[10px] font-bold text-white uppercase">
                {badgeLabel}
              </span>
            ) : null}
          </div>
        ) : null}

        {showWishlist || showCompare ? (
          <div className="absolute top-2 right-0 z-10 flex w-8 translate-x-1/2 flex-col items-center gap-1.5">
            {showWishlist ? (
              <WishlistButton
                locale={locale}
                productId={productId}
                initialInWishlist={inWishlist}
                isSignedIn={isSignedIn}
                label={wishlistLabel}
                size="sm"
                iconVariant="productCard"
                className="h-8 w-8 bg-white/90 text-neutral-800 shadow-[0_1px_5px_rgba(0,0,0,0.2)] backdrop-blur-sm"
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
                className="h-8 w-8 bg-white/55 text-neutral-800 shadow-[0_1px_5px_rgba(0,0,0,0.2)] backdrop-blur-[4px]"
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="relative z-10 -mt-[40px] flex flex-1 flex-col rounded-[20px] border border-white bg-[rgba(213,213,213,0.36)] px-[11px] pt-[11px] pb-3 backdrop-blur-[8px]">
        {metaLabel ? (
          <p className="text-[10px] leading-[15px] tracking-[1px] text-black uppercase">
            {metaLabel}
          </p>
        ) : null}

        <h3 className="mt-0.5 line-clamp-2 text-[14px] leading-[17px] font-bold text-black uppercase">
          <AppLink
            href={href}
            prefetchPolicy={priority ? "intent" : "auto"}
            className="hover:underline"
          >
            {title}
          </AppLink>
        </h3>

        {ratingLabel ? (
          <div className="mt-1.5 flex items-center gap-0.5">
            <span className="text-[13px] leading-[22.5px] font-bold tracking-[-0.23px] text-[rgba(39,39,39,0.68)]">
              {ratingLabel}
            </span>
            <Image
              src={HOME_MOBILE_ASSETS.star}
              alt=""
              width={18}
              height={17}
              className="h-[17px] w-[18px]"
              aria-hidden
            />
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="min-w-0">
            <p className="text-base leading-normal font-black text-black">
              {priceFormatted}
            </p>
            {compareAtFormatted ? (
              <p className="text-xs leading-normal text-black/60 line-through">
                {compareAtFormatted}
              </p>
            ) : null}
            {!inStock ? (
              <p className="mt-1 text-[11px] font-semibold text-neutral-600">
                {outOfStockLabel}
              </p>
            ) : null}
          </div>

          {showAddToCart ? (
            <AddToCartButton
              productId={productId}
              label={addToCartLabel}
              disabled={!inStock}
              size="sm"
              imageUrl={imageUrl}
              className="h-[52px] w-[52px] shrink-0 rounded-full bg-[#1a1c1c] text-white shadow-[0_2px_5px_rgba(0,0,0,0.25)] hover:bg-neutral-800"
            >
              <Image
                src={HOME_MOBILE_ASSETS.shopBag}
                alt=""
                width={24}
                height={24}
                className="size-6"
                aria-hidden
              />
            </AddToCartButton>
          ) : null}
        </div>
      </div>
    </article>
  );
}
