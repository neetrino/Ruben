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
        <span className="relative size-14 overflow-hidden">
          <Image
            src={PRODUCT_ASSETS.wishlistHeart}
            alt=""
            width={56}
            height={50}
            className="size-full object-contain opacity-70"
            unoptimized
          />
        </span>
      </div>

      <h2 className="mt-6 text-2xl font-bold tracking-tight text-black">
        {title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[#888]">
        {description}
      </p>

      <AppLink
        href={`/${locale}/products`}
        prefetchPolicy="intent"
        className="mt-8 inline-flex h-11 items-center gap-3 rounded-full bg-[var(--brand)] py-1.5 pr-1.5 pl-5 text-sm font-semibold text-black transition-colors hover:brightness-95"
      >
        <span>{ctaLabel}</span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/10">
          <ArrowRight className="size-4" aria-hidden />
        </span>
      </AppLink>
    </div>
  );
}
