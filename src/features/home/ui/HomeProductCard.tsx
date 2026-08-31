import Image from "next/image";
import { Plus } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import { AddToCartButton } from "@/features/cart/ui/AddToCartButton";
import { CompareButton } from "@/features/compare/ui/CompareButton";
import { WishlistButton } from "@/features/wishlist/ui/WishlistButton";
import type { Locale } from "@/lib/i18n/config";

type HomeProductCardProps = {
  href: string;
  title: string;
  brandLabel?: string | null;
  priceFormatted: string;
  compareAtFormatted?: string | null;
  discountPercent?: number | null;
  badgeLabel?: string | null;
  imageUrl: string | null;
  inStock: boolean;
  priority?: boolean;
  locale: Locale;
  productId: string;
  inWishlist: boolean;
  inCompare: boolean;
  isSignedIn: boolean;
  wishlistLabel: string;
  compareLabel: string;
  compareLimitLabel: string;
  addToCartLabel: string;
  outOfStockLabel?: string;
};

export function HomeProductCard({
  href,
  title,
  brandLabel = null,
  priceFormatted,
  compareAtFormatted = null,
  discountPercent = null,
  badgeLabel = null,
  imageUrl,
  inStock,
  priority = false,
  locale,
  productId,
  inWishlist,
  inCompare,
  isSignedIn,
  wishlistLabel,
  compareLabel,
  compareLimitLabel,
  addToCartLabel,
  outOfStockLabel = "Out of stock",
}: HomeProductCardProps) {
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
              sizes="280px"
              priority={priority}
              className="object-contain p-6"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              No image
            </div>
          )}
        </AppLink>

        <div className="absolute top-2 right-[-10px] z-10 flex w-12 flex-col items-end gap-1.5">
          <WishlistButton
            locale={locale}
            productId={productId}
            initialInWishlist={inWishlist}
            isSignedIn={isSignedIn}
            label={wishlistLabel}
            size="sm"
            className="h-12 w-12 bg-white/90 text-neutral-800 shadow-sm backdrop-blur-sm hover:bg-white"
          />
          <CompareButton
            locale={locale}
            productId={productId}
            initialInCompare={inCompare}
            isSignedIn={isSignedIn}
            label={compareLabel}
            limitReachedLabel={compareLimitLabel}
            size="sm"
            className="h-12 w-12 bg-white/45 text-neutral-800 shadow-sm backdrop-blur-sm hover:bg-white/70"
          />
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
      </div>

      <div className="relative z-10 -mt-28 rounded-[40px] bg-[rgba(131,131,131,0.11)] px-5 pt-5 pb-4 backdrop-blur-[2px] sm:-mt-32">
        {brandLabel ? (
          <p className="text-[10px] tracking-[1px] text-[#4c4546] uppercase">
            {brandLabel}
          </p>
        ) : null}
        <h3 className="mt-1 line-clamp-2 text-base font-bold text-black uppercase">
          <AppLink
            href={href}
            prefetchPolicy={priority ? "intent" : "auto"}
            className="hover:underline"
          >
            {title}
          </AppLink>
        </h3>

        <div className="mt-2 flex items-baseline gap-3">
          <p className="text-lg font-black text-black">{priceFormatted}</p>
          {compareAtFormatted ? (
            <p className="text-sm text-black/60 line-through">
              {compareAtFormatted}
            </p>
          ) : null}
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          {!inStock ? (
            <span className="text-xs font-semibold text-neutral-600">
              {outOfStockLabel}
            </span>
          ) : (
            <span className="text-sm text-transparent">·</span>
          )}

          <AddToCartButton
            productId={productId}
            label={addToCartLabel}
            disabled={!inStock}
            size="sm"
            className="h-12 w-12 bg-black text-white shadow-[0_2px_5px_rgba(0,0,0,0.25)] hover:bg-neutral-800"
          >
            <Plus className="h-[18px] w-[18px] text-white" aria-hidden />
          </AddToCartButton>
        </div>
      </div>
    </article>
  );
}
