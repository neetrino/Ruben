"use client";

import Image from "next/image";
import { useState } from "react";

import { PRODUCT_MOBILE_ASSETS } from "@/features/products/ui/product-assets";
import { ProductMobileGallery } from "@/features/products/ui/ProductMobileGallery";
import { ProductMobilePurchaseBar } from "@/features/products/ui/ProductMobilePurchaseBar";
import type { ProductDetail } from "@/features/products/types";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type ProductMobileDetailProps = {
  locale: Locale;
  product: ProductDetail;
  priceFormatted: string;
  compareAtFormatted: string | null;
  isSignedIn: boolean;
  inWishlist: boolean;
  dictionary: Dictionary;
};

const DESCRIPTION_PREVIEW_CHARS = 72;

/** Real product facets only — no invented Figma placeholder features. */
function featureLabels(
  product: ProductDetail,
  stockLabel: string,
): string[] {
  const labels: string[] = [];
  for (const category of product.categories.slice(0, 3)) {
    labels.push(category.title);
  }
  if (product.stockOnHand > 0) {
    labels.push(stockLabel);
  }
  if (labels.length === 0 && product.sku) {
    labels.push(product.sku);
  }
  return labels.slice(0, 4);
}

/**
 * Mobile single-product layout — Figma 171:345.
 * Ratings chip omitted until product ratings exist in the domain model.
 * Color hex swatches: gallery image rail (Figma 122:2933) — no color-variant SKUs yet.
 */
export function ProductMobileDetail({
  locale,
  product,
  priceFormatted,
  compareAtFormatted,
  isSignedIn,
  inWishlist,
  dictionary,
}: ProductMobileDetailProps) {
  const labels = dictionary.product;
  const inStock = product.stockOnHand > 0;
  const description = product.translation.description?.trim() ?? "";
  const [expanded, setExpanded] = useState(false);
  const needsMore = description.length > DESCRIPTION_PREVIEW_CHARS;
  const preview = needsMore
    ? `${description.slice(0, DESCRIPTION_PREVIEW_CHARS).trimEnd()} `
    : description;
  const features = featureLabels(product, labels.inStock);
  const productsHref = `/${locale}/products`;

  return (
    <div className="product-mobile-detail relative bg-[#f0f1f5] md:hidden">
      <ProductMobileGallery
        locale={locale}
        productId={product.id}
        images={product.images}
        title={product.translation.title}
        inStock={inStock}
        inStockBadge={labels.inStockBadge}
        outOfStockLabel={labels.outOfStock}
        backLabel={labels.backToProducts}
        productsHref={productsHref}
        inWishlist={inWishlist}
        isSignedIn={isSignedIn}
        wishlistLabel={dictionary.nav.wishlist}
      />

      <section className="relative z-10 -mt-[86px] rounded-t-[40px] bg-[rgba(255,255,255,0.31)] px-[22px] pt-10 pb-6 backdrop-blur-[10px]">
        <div className="flex items-start justify-between gap-3">
          <h1 className="max-w-[192px] text-lg leading-[21px] font-bold text-black uppercase">
            {product.translation.title}
          </h1>
          <div className="shrink-0 text-right">
            <p className="text-2xl leading-[30px] font-bold tracking-[-0.45px] text-[#1a1a2e]">
              {priceFormatted}
            </p>
            {compareAtFormatted ? (
              <p className="text-base leading-[30px] tracking-[-0.45px] text-black/80 line-through">
                {compareAtFormatted}
              </p>
            ) : null}
          </div>
        </div>

        {description ? (
          <p className="mt-6 text-sm leading-[22.4px] tracking-[-0.15px] text-[#777]">
            {expanded ? description : preview}
            {needsMore && !expanded ? (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="font-semibold text-[#555] underline"
              >
                {labels.readMore}
              </button>
            ) : null}
          </p>
        ) : null}

        {features.length > 0 ? (
          <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-5">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Image
                  src={PRODUCT_MOBILE_ASSETS.check}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 shrink-0"
                  unoptimized
                  aria-hidden
                />
                <span className="text-[13px] leading-[19.5px] text-black">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-8">
          <ProductMobilePurchaseBar
            productId={product.id}
            stockOnHand={product.stockOnHand}
            priceFormatted={priceFormatted}
            imageUrl={product.images[0]?.url ?? product.imageUrl}
            labels={{
              quantity: labels.quantity,
              decreaseQuantity: dictionary.cartDrawer.decreaseQuantity,
              increaseQuantity: dictionary.cartDrawer.increaseQuantity,
              addToCart: labels.addToCart,
              outOfStock: labels.outOfStock,
              error: labels.addError,
            }}
          />
        </div>
      </section>
    </div>
  );
}