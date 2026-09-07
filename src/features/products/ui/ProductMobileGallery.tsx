"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, type UIEvent } from "react";

import { PRODUCT_MOBILE_ASSETS } from "@/features/products/ui/product-assets";
import { ProductImageRail } from "@/features/products/ui/ProductImageRail";
import type { ProductGalleryImage } from "@/features/products/types";
import { WishlistButton } from "@/features/wishlist/ui/WishlistButton";
import type { Locale } from "@/lib/i18n/config";

type ProductMobileGalleryProps = {
  locale: Locale;
  productId: string;
  images: ProductGalleryImage[];
  title: string;
  inStock: boolean;
  inStockBadge: string;
  outOfStockLabel: string;
  backLabel: string;
  productsHref: string;
  inWishlist: boolean;
  isSignedIn: boolean;
  wishlistLabel: string;
};

/**
 * Mobile product hero — Figma 171:345 / 122:2910.
 * Right rail (122:2933) switches gallery images (no color-variant model yet).
 */
export function ProductMobileGallery({
  locale,
  productId,
  images,
  title,
  inStock,
  inStockBadge,
  outOfStockLabel,
  backLabel,
  productsHref,
  inWishlist,
  isSignedIn,
  wishlistLabel,
}: ProductMobileGalleryProps) {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = Math.max(images.length, 1);
  const activeId = (images[activeIndex] ?? images[0])?.id ?? null;

  function goBack(): void {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(productsHref);
  }

  /** Keeps rail and pagination in sync while the finger drags the track. */
  function handleScroll(event: UIEvent<HTMLDivElement>): void {
    const track = event.currentTarget;
    if (track.clientWidth === 0) return;

    const next = Math.round(track.scrollLeft / track.clientWidth);
    if (next !== activeIndex && next >= 0 && next < images.length) {
      setActiveIndex(next);
    }
  }

  function scrollToIndex(index: number): void {
    const track = trackRef.current;
    if (!track) return;

    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
    setActiveIndex(index);
  }

  function selectById(imageId: string): void {
    const index = images.findIndex((image) => image.id === imageId);
    if (index >= 0) {
      scrollToIndex(index);
    }
  }

  return (
    <div className="relative aspect-[375/506] w-full overflow-hidden bg-[linear-gradient(154deg,#f0f1f5_8%,#e8eaf0_92%)]">
      {images.length > 0 ? (
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative h-full w-full shrink-0 snap-center"
            >
              <Image
                src={image.url}
                alt={image.alt || title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-neutral-400">
          No image
        </div>
      )}

      <button
        type="button"
        onClick={goBack}
        aria-label={backLabel}
        className="absolute top-5 left-5 z-20 inline-flex size-[42px] items-center justify-center rounded-[14px] bg-white/92 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      >
        <Image
          src={PRODUCT_MOBILE_ASSETS.back}
          alt=""
          width={10}
          height={17}
          className="h-[17px] w-2.5"
          unoptimized
          aria-hidden
        />
      </button>

      <WishlistButton
        locale={locale}
        productId={productId}
        initialInWishlist={inWishlist}
        isSignedIn={isSignedIn}
        label={wishlistLabel}
        iconVariant="productCard"
        className="absolute top-5 right-5 z-20 size-[42px] rounded-[14px] border-0 bg-white/92 text-[#1a1c1c] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-white"
      />

      <span
        className={`absolute top-[78px] right-4 z-20 inline-flex h-[30px] items-center rounded-[10px] px-4 text-sm text-[#1b1b1b] ${
          inStock ? "bg-[#bfe66a]" : "bg-neutral-300"
        }`}
      >
        {inStock ? inStockBadge : outOfStockLabel}
      </span>

      <ProductImageRail
        images={images}
        activeId={activeId}
        title={title}
        onSelect={selectById}
        className="absolute top-[174px] right-0 z-20"
      />

      {slideCount > 1 ? (
        <div
          className="absolute bottom-[132px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-1"
          aria-hidden
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              aria-label={`${index + 1}`}
              onClick={() => scrollToIndex(index)}
              className={`h-[3px] w-5 rounded-[2px] transition-colors ${
                index === activeIndex
                  ? "bg-black/35"
                  : "bg-black/12"
              }`}
            />
          ))}
        </div>
      ) : (
        <div
          className="absolute bottom-[132px] left-1/2 z-20 flex h-[3px] w-[60px] -translate-x-1/2 overflow-hidden rounded-[2px] bg-black/12"
          aria-hidden
        >
          <span className="h-full w-5 rounded-[2px] bg-black/35" />
        </div>
      )}
    </div>
  );
}
