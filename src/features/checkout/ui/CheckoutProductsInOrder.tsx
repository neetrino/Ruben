"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { X } from "lucide-react";

import { adjustLocalCartItemCount } from "@/features/cart/cart-client-sync";
import { removeItem } from "@/features/cart/cart";
import type { CheckoutOrderProduct } from "@/features/checkout/ui/checkout-order-product";
import type { Locale } from "@/lib/i18n/config";
import { formatMoneyAmount } from "@/lib/money/format";

const THUMB_SIZE_PX = 96;
const CARD_MIN_WIDTH_PX = 200;
const CARD_MAX_WIDTH_PX = 320;
const TITLE_MAX_WIDTH_PX = 168;

type CheckoutProductsInOrderProps = {
  products: CheckoutOrderProduct[];
  title: string;
  itemsOneLabel: string;
  itemsManyLabel: string;
  removeItemLabel: string;
  locale: Locale;
  onCartChanged?: () => void;
};

function formatItemCount(
  count: number,
  itemsOneLabel: string,
  itemsManyLabel: string,
): string {
  if (count === 1) {
    return itemsOneLabel;
  }
  return itemsManyLabel.replace("{count}", String(count));
}

type CheckoutOrderItemCardProps = {
  product: CheckoutOrderProduct;
  locale: Locale;
  removeItemLabel: string;
  onRemove: (itemId: string) => void;
};

function CheckoutOrderItemCard({
  product,
  locale,
  removeItemLabel,
  onRemove,
}: CheckoutOrderItemCardProps) {
  return (
    <article
      className="w-max shrink-0 rounded-[20px] border border-gray-200 bg-white p-3 shadow-sm"
      style={{
        minWidth: CARD_MIN_WIDTH_PX,
        maxWidth: CARD_MAX_WIDTH_PX,
      }}
    >
      <div className="flex items-stretch gap-3">
        <div
          className="relative block shrink-0 self-stretch overflow-hidden rounded-2xl bg-[#eaeaea]"
          style={{
            width: THUMB_SIZE_PX,
            minHeight: THUMB_SIZE_PX,
          }}
        >
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              sizes="96px"
              className="object-contain p-0.5"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              —
            </div>
          )}
        </div>

        <div className="flex w-max min-w-0 max-w-full flex-1 flex-col justify-between gap-2">
          <div className="flex items-start justify-between gap-2">
            <div
              className="w-max min-w-0 max-w-full"
              style={{ maxWidth: TITLE_MAX_WIDTH_PX }}
            >
              <p className="line-clamp-2 text-sm font-medium text-gray-900">
                {product.title}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {formatMoneyAmount(product.lineTotalAmount, "AMD", locale)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(product.id)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label={removeItemLabel}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <span className="inline-flex h-6 w-fit min-w-[24px] shrink-0 items-center justify-center rounded-full border border-gray-200 bg-sky-50/70 px-2 text-[11px] font-semibold text-gray-900">
            ×{product.quantity}
          </span>
        </div>
      </div>
    </article>
  );
}

export function CheckoutProductsInOrder({
  products: initialProducts,
  title,
  itemsOneLabel,
  itemsManyLabel,
  removeItemLabel,
  locale,
  onCartChanged,
}: CheckoutProductsInOrderProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [prevInitialProducts, setPrevInitialProducts] = useState(initialProducts);
  const [, startTransition] = useTransition();

  if (initialProducts !== prevInitialProducts) {
    setPrevInitialProducts(initialProducts);
    setProducts(initialProducts);
  }

  const itemCount = products.reduce((sum, product) => sum + product.quantity, 0);

  if (products.length === 0) {
    return null;
  }

  function onRemove(itemId: string): void {
    const current = products.find((product) => product.id === itemId);
    if (!current) return;

    const previous = products;
    setProducts((list) => list.filter((product) => product.id !== itemId));
    adjustLocalCartItemCount(-current.quantity);
    onCartChanged?.();

    startTransition(async () => {
      try {
        await removeItem(itemId);
        router.refresh();
      } catch {
        setProducts(previous);
        adjustLocalCartItemCount(current.quantity);
      }
    });
  }

  return (
    <section
      className="rounded-[15px] border border-gray-200 bg-white px-5 py-4 sm:px-6 sm:py-5"
      aria-labelledby="checkout-order-items-title"
    >
      <div className="flex items-start justify-between gap-4">
        <h2
          id="checkout-order-items-title"
          className="text-sm font-bold tracking-wide text-gray-900"
        >
          {title}
        </h2>
        <p className="shrink-0 text-sm text-gray-500">
          {formatItemCount(itemCount, itemsOneLabel, itemsManyLabel)}
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto overscroll-x-contain pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <CheckoutOrderItemCard
            key={product.id}
            product={product}
            locale={locale}
            removeItemLabel={removeItemLabel}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  );
}
