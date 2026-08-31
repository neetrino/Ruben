"use client";

import type { MouseEvent, ReactNode } from "react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { addToCart } from "@/features/cart/cart";
import { flyToCart } from "@/features/cart/ui/fly-to-cart";

type AddToCartButtonProps = {
  productId: string;
  label: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
  /** Product image used for the fly-to-cart mini preview. */
  imageUrl?: string | null;
  /** Replaces the default cart icon when provided. */
  children?: ReactNode;
};

export function AddToCartButton({
  productId,
  label,
  disabled = false,
  className = "",
  size = "md",
  imageUrl = null,
  children,
}: AddToCartButtonProps) {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);
  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    event.stopPropagation();
    if (disabled || pending) return;

    if (buttonRef.current) {
      flyToCart({ from: buttonRef.current, imageUrl });
    }

    startTransition(async () => {
      try {
        await addToCart(productId, 1);
        setJustAdded(true);
        router.refresh();
        window.setTimeout(() => setJustAdded(false), 1500);
      } catch {
        setJustAdded(false);
      }
    });
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      disabled={disabled || pending}
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children ?? (
        <ShoppingCart
          className={`${iconClass} ${
            justAdded ? "fill-gray-900 text-gray-900" : "text-gray-700"
          }`}
          aria-hidden
        />
      )}
    </button>
  );
}
