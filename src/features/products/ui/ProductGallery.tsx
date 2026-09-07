"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useSnapCarousel } from "@/features/products/ui/use-snap-carousel";
import type { ProductGalleryImage } from "@/features/products/types";

const ARROW_CLASS =
  "absolute top-1/2 z-20 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-800 opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-opacity duration-200 group-hover:opacity-100 hover:bg-white focus-visible:opacity-100";

type ProductGalleryProps = {
  images: ProductGalleryImage[];
  title: string;
  discountPercent?: number | null;
  badgeLabel?: string | null;
  inStock: boolean;
  outOfStockLabel: string;
  previousImageLabel: string;
  nextImageLabel: string;
};

export function ProductGallery({
  images,
  title,
  discountPercent = null,
  badgeLabel = null,
  inStock,
  outOfStockLabel,
  previousImageLabel,
  nextImageLabel,
}: ProductGalleryProps) {
  const { trackRef, activeIndex, handleScroll, scrollToIndex } =
    useSnapCarousel(images.length);

  /** Wraps around so the arrows never dead-end. */
  function step(offset: number): void {
    if (images.length < 2) return;

    scrollToIndex((activeIndex + offset + images.length) % images.length);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="group relative aspect-[717/538] w-full overflow-hidden rounded-[40px] bg-[#eaeaea]">
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
                  sizes="(max-width: 767px) 100vw, 55vw"
                  className="object-contain p-6"
                  priority={index === 0}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
            No image
          </div>
        )}

        {discountPercent != null || badgeLabel || !inStock ? (
          <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-2">
            {discountPercent != null ? (
              <span className="inline-flex rounded-full bg-[var(--brand)] px-3 py-1 text-[10px] leading-[15px] font-bold text-white">
                -{discountPercent}%
              </span>
            ) : null}
            {badgeLabel ? (
              <span className="inline-flex rounded-full bg-black px-3 py-1 text-[10px] leading-[15px] font-bold text-white uppercase">
                {badgeLabel}
              </span>
            ) : null}
            {!inStock ? (
              <span className="inline-flex rounded-full bg-neutral-800/90 px-3 py-1 text-[10px] leading-[15px] font-bold text-white">
                {outOfStockLabel}
              </span>
            ) : null}
          </div>
        ) : null}

        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label={previousImageLabel}
              onClick={() => step(-1)}
              className={`${ARROW_CLASS} left-4`}
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label={nextImageLabel}
              onClick={() => step(1)}
              className={`${ARROW_CLASS} right-4`}
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="flex gap-3 overflow-x-auto pb-1" role="list">
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={image.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => scrollToIndex(index)}
                  aria-label={image.alt || title}
                  aria-pressed={isActive}
                  className={`relative size-20 overflow-hidden rounded-2xl border-2 bg-[#eaeaea] transition ${
                    isActive
                      ? "border-[#212121]"
                      : "border-[#e0e0e0] hover:border-neutral-400"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
