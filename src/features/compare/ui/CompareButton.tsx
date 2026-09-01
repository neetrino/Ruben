"use client";

import type { MouseEvent } from "react";
import { GitCompareArrows } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { ProductCardCompareIcon } from "@/components/icons/product-card-icons";
import { toggleCompareAction } from "@/features/compare/actions";
import type { Locale } from "@/lib/i18n/config";

type CompareButtonProps = {
  locale: Locale;
  productId: string;
  initialInCompare: boolean;
  isSignedIn: boolean;
  label: string;
  limitReachedLabel?: string;
  className?: string;
  size?: "sm" | "md";
  /** Use Figma product-card swap arrows instead of Lucide. */
  iconVariant?: "default" | "productCard";
};

export function CompareButton({
  locale,
  productId,
  initialInCompare,
  isSignedIn,
  label,
  limitReachedLabel,
  className = "",
  size = "md",
  iconVariant = "default",
}: CompareButtonProps) {
  const router = useRouter();
  const [inCompare, setInCompare] = useState(initialInCompare);
  const [pending, startTransition] = useTransition();
  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const productCardIconClass = size === "sm" ? "h-5 w-[15px]" : "h-6 w-[18px]";

  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    event.stopPropagation();

    if (!isSignedIn) {
      const next = encodeURIComponent(
        typeof window !== "undefined" ? window.location.pathname : `/${locale}`,
      );
      router.push(`/${locale}/login?next=${next}`);
      return;
    }

    startTransition(async () => {
      const previous = inCompare;
      setInCompare(!previous);
      const result = await toggleCompareAction(productId);
      if (!result.ok) {
        setInCompare(previous);
        if (result.error.code === "UNAUTHENTICATED") {
          router.push(`/${locale}/login`);
          return;
        }
        if (result.error.code === "COMPARE_LIMIT" && limitReachedLabel) {
          window.alert(limitReachedLabel);
        }
        return;
      }
      setInCompare(result.value.inCompare);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={label}
      aria-pressed={inCompare}
      className={`inline-flex items-center justify-center rounded-full transition disabled:opacity-60 ${className}`}
    >
      {iconVariant === "productCard" ? (
        <ProductCardCompareIcon
          className={`${productCardIconClass} ${
            inCompare ? "text-[var(--brand)]" : "text-[#1A1C1C]"
          }`}
        />
      ) : (
        <GitCompareArrows
          className={`${iconClass} ${
            inCompare ? "text-[var(--brand)]" : "text-gray-700"
          }`}
          strokeWidth={inCompare ? 2.5 : 1.75}
          aria-hidden
        />
      )}
    </button>
  );
}
