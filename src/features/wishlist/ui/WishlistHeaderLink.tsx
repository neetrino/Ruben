"use client";

import Image from "next/image";
import { Heart } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import { useWishlistCount } from "@/features/wishlist/wishlist-client-sync";
import type { Locale } from "@/lib/i18n/config";

type WishlistHeaderLinkProps = {
  locale: Locale;
  label: string;
  count: number;
  className?: string;
  iconSrc?: string;
};

export function WishlistHeaderLink({
  locale,
  label,
  count,
  className = "relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-700 transition-colors duration-150 hover:text-gray-900",
  iconSrc,
}: WishlistHeaderLinkProps) {
  const badgeCount = useWishlistCount(count);

  return (
    <AppLink
      href={`/${locale}/wishlist`}
      prefetchPolicy="intent"
      aria-label={label}
      className={className}
    >
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt=""
          width={35}
          height={35}
          className="size-[35px]"
          aria-hidden
        />
      ) : (
        <Heart className="h-5 w-5" aria-hidden="true" />
      )}
      {badgeCount > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-semibold text-black">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      ) : null}
    </AppLink>
  );
}
