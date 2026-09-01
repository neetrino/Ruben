"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { adjustLocalCartItemCount } from "@/features/cart/cart-client-sync";
import { addToCart } from "@/features/cart/cart";
import { flyToCart } from "@/features/cart/ui/fly-to-cart";
import { CompareButton } from "@/features/compare/ui/CompareButton";
import { PRODUCT_ASSETS } from "@/features/products/ui/product-assets";
import { WishlistButton } from "@/features/wishlist/ui/WishlistButton";
import type { Locale } from "@/lib/i18n/config";

type ProductPurchaseControlsProps = {
  locale: Locale;
  productId: string;
  stockOnHand: number;
  inWishlist: boolean;
  inCompare: boolean;
  isSignedIn: boolean;
  wishlistLabel: string;
  compareLabel: string;
  compareLimitLabel: string;
  imageUrl?: string | null;
  labels: {
    quantity: string;
    decreaseQuantity: string;
    increaseQuantity: string;
    addToCart: string;
    adding: string;
    outOfStock: string;
    error: string;
  };
};

export function ProductPurchaseControls({
  locale,
  productId,
  stockOnHand,
  inWishlist,
  inCompare,
  isSignedIn,
  wishlistLabel,
  compareLabel,
  compareLimitLabel,
  imageUrl = null,
  labels,
}: ProductPurchaseControlsProps) {
  const router = useRouter();
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const maxQty = Math.max(stockOnHand, 0);
  const [quantity, setQuantity] = useState(maxQty > 0 ? 1 : 0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const disabled = maxQty < 1;

  function changeQuantity(next: number): void {
    if (disabled) return;
    setQuantity(Math.min(Math.max(1, next), maxQty));
    setError(null);
  }

  function handleAdd(): void {
    if (disabled || quantity < 1) return;
    setError(null);

    if (addButtonRef.current) {
      flyToCart({ from: addButtonRef.current, imageUrl });
    }
    adjustLocalCartItemCount(quantity);

    startTransition(async () => {
      try {
        await addToCart(productId, quantity);
        router.refresh();
      } catch {
        adjustLocalCartItemCount(-quantity);
        setError(labels.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex h-[46px] w-[130px] items-center overflow-hidden rounded-full border border-[#e0e0e0] bg-white">
          <button
            type="button"
            aria-label={labels.decreaseQuantity}
            disabled={disabled || quantity <= 1 || pending}
            onClick={() => changeQuantity(quantity - 1)}
            className="flex size-11 shrink-0 items-center justify-center text-[20px] leading-none text-[#212121] transition hover:bg-neutral-50 disabled:opacity-40"
          >
            −
          </button>
          <span
            className="min-w-10 flex-1 text-center text-base font-semibold text-[#212121]"
            aria-label={labels.quantity}
          >
            {quantity}
          </span>
          <button
            type="button"
            aria-label={labels.increaseQuantity}
            disabled={disabled || quantity >= maxQty || pending}
            onClick={() => changeQuantity(quantity + 1)}
            className="flex size-11 shrink-0 items-center justify-center text-[20px] leading-none text-[#212121] transition hover:bg-neutral-50 disabled:opacity-40"
          >
            +
          </button>
        </div>

        <button
          ref={addButtonRef}
          type="button"
          disabled={disabled || pending}
          onClick={handleAdd}
          className="inline-flex h-11 min-w-[160px] flex-1 items-center justify-center gap-2 rounded-full bg-[#212121] px-6 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {!disabled ? (
            <span className="relative size-[18px] shrink-0 overflow-hidden">
              <Image
                src={PRODUCT_ASSETS.cartPlus}
                alt=""
                width={18}
                height={18}
                className="size-full"
                unoptimized
              />
            </span>
          ) : null}
          {disabled
            ? labels.outOfStock
            : pending
              ? labels.adding
              : labels.addToCart}
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <WishlistButton
            locale={locale}
            productId={productId}
            initialInWishlist={inWishlist}
            isSignedIn={isSignedIn}
            label={wishlistLabel}
            iconVariant="productCard"
            className="size-11 shrink-0 border border-[#e0e0e0] bg-white text-[#1a1c1c] hover:bg-neutral-50"
          />
          <CompareButton
            locale={locale}
            productId={productId}
            initialInCompare={inCompare}
            isSignedIn={isSignedIn}
            label={compareLabel}
            limitReachedLabel={compareLimitLabel}
            iconVariant="productCard"
            className="size-11 shrink-0 border border-[#e0e0e0] bg-white text-[#1a1c1c] hover:bg-neutral-50"
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
