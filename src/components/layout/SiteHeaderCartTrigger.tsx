"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";

import { HEADER_ASSETS } from "@/components/layout/header-assets";
import { CartDrawer } from "@/features/cart/ui/CartDrawer";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { Currency } from "@/lib/money/currency";

type SiteHeaderCartTriggerProps = {
  locale: Locale;
  currency: Currency;
  dictionary: Dictionary;
  itemCount: number;
  /** Desktop uses Figma cart SVG; mobile uses lucide for clarity at small size. */
  variant?: "desktop" | "mobile";
};

const ICON_BUTTON =
  "relative inline-flex size-9 items-center justify-center text-white transition-opacity hover:opacity-80";

export function SiteHeaderCartTrigger({
  locale,
  currency,
  dictionary,
  itemCount,
  variant = "desktop",
}: SiteHeaderCartTriggerProps) {
  return (
    <CartDrawer
      locale={locale}
      currency={currency}
      dictionary={dictionary}
      itemCount={itemCount}
      renderTrigger={({
        badgeCount,
        label,
        openDrawer,
        prefetchDrawerView,
        open,
      }) => (
        <button
          type="button"
          onClick={openDrawer}
          onPointerEnter={prefetchDrawerView}
          onFocus={prefetchDrawerView}
          className={ICON_BUTTON}
          aria-label={label}
          aria-expanded={open}
        >
          {variant === "desktop" ? (
            <Image
              src={HEADER_ASSETS.cart}
              alt=""
              width={24}
              height={24}
              className="size-6"
              aria-hidden
            />
          ) : (
            <ShoppingCart className="size-5 text-white" aria-hidden />
          )}
          {badgeCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-semibold text-black">
              {badgeCount > 99 ? "99+" : badgeCount}
            </span>
          ) : null}
        </button>
      )}
    />
  );
}
