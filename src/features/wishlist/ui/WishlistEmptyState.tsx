import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import { PRODUCT_ASSETS } from "@/features/products/ui/product-assets";

type WishlistEmptyStateProps = {
  locale: string;
  title: string;
  description: string;
  ctaLabel: string;
};

export function WishlistEmptyState({
  locale,
  title,
  description,
  ctaLabel,
}: WishlistEmptyStateProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex size-28 items-center justify-center rounded-full bg-[#eaeaea]">
        <span className="relative size-20 overflow-hidden">
          <Image
            src={PRODUCT_ASSETS.wishlistHeart}
            alt=""
            width={80}
            height={72}
            className="size-full object-contain opacity-70"
            unoptimized
          />
        </span>
      </div>

      <div className="mt-6 inline-grid max-w-full grid-cols-[auto] justify-items-stretch">
        <h2 className="text-2xl font-bold tracking-tight whitespace-nowrap text-black">
          {title}
        </h2>
        <p className="mt-3 w-0 min-w-full text-sm leading-relaxed text-[#888]">
          {description}
        </p>
        <AppLink
          href={`/${locale}/products`}
          prefetchPolicy="intent"
          className="mt-8 inline-flex h-11 w-full items-center gap-3 rounded-full bg-[var(--brand)] py-1.5 pr-1.5 pl-5 text-sm font-semibold text-black transition-colors hover:brightness-95"
        >
          <span className="min-w-0 flex-1 text-center">{ctaLabel}</span>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/10">
            <ArrowRight className="size-4" aria-hidden />
          </span>
        </AppLink>
      </div>
    </div>
  );
}
