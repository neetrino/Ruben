"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { HOME_ASSETS } from "@/features/home/config/assets";
import { HomeMobileChevronButton } from "@/features/home/ui/HomeMobileChevronButton";
import type { StorefrontHeroSlide } from "@/features/hero/application/queries";

type HomeMobileHeroCarouselProps = {
  brandName: string;
  slides: StorefrontHeroSlide[];
  prevSlideLabel: string;
  nextSlideLabel: string;
  fallbackImageSrc?: string;
};

function slideImageCandidate(slide: StorefrontHeroSlide | null): string | null {
  return slide?.mobileImageUrl ?? slide?.desktopImageUrl ?? null;
}

/**
 * Mobile home hero image carousel with side arrows and dots (Figma 171:533).
 */
export function HomeMobileHeroCarousel({
  brandName,
  slides,
  prevSlideLabel,
  nextSlideLabel,
  fallbackImageSrc = HOME_ASSETS.heroProduct,
}: HomeMobileHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedUrls, setFailedUrls] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const slideCount = Math.max(slides.length, 1);
  const activeSlide = slides[activeIndex] ?? null;
  const candidate = slideImageCandidate(activeSlide);
  const imageSrc =
    candidate && !failedUrls.has(candidate) ? candidate : fallbackImageSrc;

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((current) => (current - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const goNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % slideCount);
  }, [slideCount]);

  const handleImageError = useCallback(() => {
    if (!candidate || candidate === fallbackImageSrc) {
      return;
    }
    setFailedUrls((current) => {
      if (current.has(candidate)) {
        return current;
      }
      const next = new Set(current);
      next.add(candidate);
      return next;
    });
  }, [candidate, fallbackImageSrc]);

  return (
    <>
      <div className="relative mt-6">
        <div className="relative mx-auto aspect-[344/198] w-full max-w-[344px] overflow-hidden rounded-[10px] bg-neutral-100">
          <Image
            key={imageSrc}
            src={imageSrc}
            alt={activeSlide?.copy.title ?? brandName}
            fill
            priority
            sizes="344px"
            className="object-cover"
            onError={handleImageError}
          />
        </div>

        {slides.length > 1 ? (
          <div className="pointer-events-none absolute inset-y-0 left-1/2 flex w-[min(100%,367px)] -translate-x-1/2 items-center justify-between px-0">
            <HomeMobileChevronButton
              label={prevSlideLabel}
              direction="left"
              onClick={goPrev}
              className="pointer-events-auto"
            />
            <HomeMobileChevronButton
              label={nextSlideLabel}
              direction="right"
              onClick={goNext}
              className="pointer-events-auto"
            />
          </div>
        ) : null}
      </div>

      <div
        className="mt-4 flex items-center justify-center gap-1"
        aria-hidden={slides.length <= 1}
      >
        {(slides.length > 1 ? slides : [null, null, null]).map((slide, index) => {
          const isActive = slides.length > 1 ? index === activeIndex : index === 0;
          if (slides.length > 1 && slide) {
            return (
              <button
                key={slide.id}
                type="button"
                aria-label={`${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`size-3 rounded-full transition-colors ${
                  isActive ? "bg-[var(--brand)]" : "bg-[#d9d9d9]"
                }`}
              />
            );
          }
          return (
            <span
              key={`dot-${index}`}
              className={`size-3 rounded-full ${
                isActive ? "bg-[var(--brand)]" : "bg-[#d9d9d9]"
              }`}
            />
          );
        })}
      </div>
    </>
  );
}
