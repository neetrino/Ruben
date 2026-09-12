"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { HOME_ASSETS } from "@/features/home/config/assets";
import type { StorefrontHeroSlide } from "@/features/hero/application/queries";
import { useSnapCarousel } from "@/features/products/ui/use-snap-carousel";

type HomeMobileHeroCarouselProps = {
  brandName: string;
  slides: StorefrontHeroSlide[];
  fallbackImageSrc?: string;
};

const SLIDE_AUTO_MS = 6000;
const AUTOPLAY_RESUME_MS = 4000;

function slideImageCandidate(slide: StorefrontHeroSlide | null): string | null {
  return slide?.mobileImageUrl ?? slide?.desktopImageUrl ?? null;
}

/**
 * Mobile home hero image carousel — native snap swipe + dots (same as PDP gallery).
 */
export function HomeMobileHeroCarousel({
  brandName,
  slides,
  fallbackImageSrc = HOME_ASSETS.heroProduct,
}: HomeMobileHeroCarouselProps) {
  const [failedUrls, setFailedUrls] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const resumeTimerRef = useRef<number | null>(null);

  const displaySlides =
    slides.length > 0
      ? slides
      : [
          {
            id: "fallback",
            sortOrder: 0,
            copy: { title: brandName },
            desktopImageUrl: null,
            mobileImageUrl: null,
          } satisfies StorefrontHeroSlide,
        ];

  const slideCount = displaySlides.length;
  const canSwipe = slideCount > 1;
  const { trackRef, activeIndex, handleScroll, scrollToIndex } =
    useSnapCarousel(slideCount);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current != null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const pauseAutoplay = useCallback(() => {
    clearResumeTimer();
    setAutoplayPaused(true);
  }, [clearResumeTimer]);

  const scheduleAutoplayResume = useCallback(() => {
    clearResumeTimer();
    resumeTimerRef.current = window.setTimeout(() => {
      setAutoplayPaused(false);
      resumeTimerRef.current = null;
    }, AUTOPLAY_RESUME_MS);
  }, [clearResumeTimer]);

  useEffect(() => () => clearResumeTimer(), [clearResumeTimer]);

  useEffect(() => {
    if (!canSwipe || autoplayPaused) return;

    const timer = window.setInterval(() => {
      const next = (activeIndex + 1) % slideCount;
      scrollToIndex(next);
    }, SLIDE_AUTO_MS);

    return () => window.clearInterval(timer);
  }, [activeIndex, autoplayPaused, canSwipe, scrollToIndex, slideCount]);

  const markFailed = useCallback(
    (url: string) => {
      if (url === fallbackImageSrc) return;
      setFailedUrls((current) => {
        if (current.has(url)) return current;
        const next = new Set(current);
        next.add(url);
        return next;
      });
    },
    [fallbackImageSrc],
  );

  return (
    <>
      <div className="relative mt-6 tablet:mt-12">
        <div className="relative aspect-[344/198] w-full overflow-hidden rounded-[20px] bg-neutral-100">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            onPointerDown={canSwipe ? pauseAutoplay : undefined}
            onPointerUp={canSwipe ? scheduleAutoplayResume : undefined}
            onPointerCancel={canSwipe ? scheduleAutoplayResume : undefined}
            className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {displaySlides.map((slide, index) => {
              const candidate = slideImageCandidate(slide);
              const src =
                candidate && !failedUrls.has(candidate)
                  ? candidate
                  : fallbackImageSrc;

              return (
                <div
                  key={slide.id}
                  className="relative h-full w-full shrink-0 snap-center"
                >
                  <Image
                    src={src}
                    alt={slide.copy.title || brandName}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1023px) calc(100vw - 28px), 720px"
                    className="pointer-events-none select-none object-cover"
                    draggable={false}
                    onError={() => {
                      if (candidate) markFailed(candidate);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="mt-4 flex items-center justify-center gap-1"
        aria-hidden={!canSwipe}
      >
        {(canSwipe ? displaySlides : [null, null, null]).map((slide, index) => {
          const isActive = canSwipe ? index === activeIndex : index === 0;
          if (canSwipe && slide) {
            return (
              <button
                key={slide.id}
                type="button"
                aria-label={`${index + 1}`}
                onClick={() => {
                  pauseAutoplay();
                  scrollToIndex(index);
                  scheduleAutoplayResume();
                }}
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
