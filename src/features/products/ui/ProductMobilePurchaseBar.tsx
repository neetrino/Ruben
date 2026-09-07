"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { adjustLocalCartItemCount } from "@/features/cart/cart-client-sync";
import { addToCart } from "@/features/cart/cart";
import { flyToCart } from "@/features/cart/ui/fly-to-cart";
import { PRODUCT_MOBILE_ASSETS } from "@/features/products/ui/product-assets";

type ProductMobilePurchaseBarProps = {
  productId: string;
  stockOnHand: number;
  priceFormatted: string;
  imageUrl: string | null;
  labels: {
    quantity: string;
    decreaseQuantity: string;
    increaseQuantity: string;
    addToCart: string;
    outOfStock: string;
    error: string;
  };
};

/**
 * In-flow mobile purchase pill — Figma 122:2985.
 * Renders under the product description (not sticky / fixed).
 */
export function ProductMobilePurchaseBar({
  productId,
  stockOnHand,
  priceFormatted,
  imageUrl,
  labels,
}: ProductMobilePurchaseBarProps) {
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
    <div className="relative flex w-full items-center gap-3 rounded-[60px] bg-[rgba(0,0,0,0.34)] py-2.5 pr-2.5 pl-5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-[8px]">
      <div className="flex h-[46px] min-w-0 flex-1 items-center justify-center rounded-[30px] bg-white px-3">
        <p className="truncate text-xl leading-[30px] font-bold tracking-[-0.45px] text-[#1a1a2e]">
          {priceFormatted}
        </p>
      </div>

      <div className="flex h-[46px] shrink-0 items-center gap-0.5 rounded-[50px] bg-white px-0.5">
        <button
          type="button"
          aria-label={labels.decreaseQuantity}
          disabled={disabled || quantity <= 1 || pending}
          onClick={() => changeQuantity(quantity - 1)}
          className="inline-flex size-8 items-center justify-center rounded-2xl text-xl leading-5 tracking-[-0.45px] text-[#555] disabled:opacity-40"
        >
          –
        </button>
        <span
          className="min-w-4 text-center text-[15px] leading-[22.5px] font-bold tracking-[-0.23px] text-[#1a1a2e]"
          aria-label={labels.quantity}
        >
          {quantity}
        </span>
        <button
          type="button"
          aria-label={labels.increaseQuantity}
          disabled={disabled || quantity >= maxQty || pending}
          onClick={() => changeQuantity(quantity + 1)}
          className="inline-flex size-8 items-center justify-center rounded-2xl text-xl leading-5 tracking-[-0.45px] text-[#555] disabled:opacity-40"
        >
          +
        </button>
      </div>

      <button
        ref={addButtonRef}
        type="button"
        aria-label={disabled ? labels.outOfStock : labels.addToCart}
        disabled={disabled || pending}
        onClick={handleAdd}
        className="inline-flex size-[52px] shrink-0 items-center justify-center rounded-full bg-[#1a1c1c] disabled:opacity-50"
      >
        <Image
          src={PRODUCT_MOBILE_ASSETS.shopBag}
          alt=""
          width={24}
          height={24}
          className="size-6"
          unoptimized
          aria-hidden
        />
      </button>

      {error ? (
        <p
          className="absolute top-full left-0 mt-2 rounded-lg bg-white px-3 py-1 text-sm text-red-700 shadow"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
