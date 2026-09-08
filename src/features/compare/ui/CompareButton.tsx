"use client";

import type { MouseEvent } from "react";
import { GitCompareArrows } from "lucide-react";
import { useRouter } from "next/navigation";

import { ProductCardCompareIcon } from "@/components/icons/product-card-icons";
import { toggleCompareAction } from "@/features/compare/actions";
import {
  adjustCompareCountDelta,
  setCompareOverride,
  useCompareMembership,
} from "@/features/compare/compare-client-sync";
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
  const inCompare = useCompareMembership(productId, initialInCompare);
  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const productCardIconClass = size === "sm" ? "h-5 w-[15px]" : "h-6 w-[18px]";

  async function syncCompare(next: boolean): Promise<void> {
    const result = await toggleCompareAction(productId);

    if (!result.ok) {
      setCompareOverride(productId, !next);
      adjustCompareCountDelta(next ? -1 : 1);
      if (result.error.code === "UNAUTHENTICATED") {
        router.push(`/${locale}/login`);
        return;
      }
      if (result.error.code === "COMPARE_LIMIT" && limitReachedLabel) {
        window.alert(limitReachedLabel);
      }
      return;
    }

    if (result.value.inCompare !== next) {
      setCompareOverride(productId, result.value.inCompare);
      adjustCompareCountDelta(result.value.inCompare ? 2 : -2);
    }
    router.refresh();
  }

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

    const next = !inCompare;
    setCompareOverride(productId, next);
    adjustCompareCountDelta(next ? 1 : -1);
    void syncCompare(next);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={inCompare}
      className={`inline-flex items-center justify-center rounded-full transition ${className}`}
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
