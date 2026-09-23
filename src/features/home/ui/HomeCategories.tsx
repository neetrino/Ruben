"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { MotionChip, MotionChipRow } from "@/components/motion/MotionChipRow";
import { AppLink } from "@/components/ui/AppLink";
import { HOME_ASSETS } from "@/features/home/config/assets";

export type HomeCategoryItem = {
  id: string;
  title: string;
  href: string;
  imageUrl: string | null;
};

type HomeCategoriesProps = {
  categories: readonly HomeCategoryItem[];
  emptyLabel: string;
  prevLabel: string;
  nextLabel: string;
};

export function HomeCategories({
  categories,
  emptyLabel,
  prevLabel,
  nextLabel,
}: HomeCategoriesProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const chipScrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());
  const chipRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const [activeArrow, setActiveArrow] = useState<-1 | 1>(1);
  const resolvedActiveId = categories.some((category) => category.id === activeId)
    ? activeId
    : (categories[0]?.id ?? "");

  const selectCategory = useCallback((id: string) => {
    setActiveId(id);
    const scroller = scrollerRef.current;
    const card = cardRefs.current.get(id);
    if (scroller && card) {
      const scrollerRect = scroller.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const nextLeft =
        scroller.scrollLeft +
        (cardRect.left - scrollerRect.left) -
        (scrollerRect.width - cardRect.width) / 2;
      const maxLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      scroller.scrollTo({
        left: Math.min(maxLeft, Math.max(0, nextLeft)),
        behavior: "smooth",
      });
    }

    // Keep the active top pill fully in view (especially the last one).
    const chipScroller = chipScrollerRef.current;
    const chip = chipRefs.current.get(id);
    if (chipScroller && chip) {
      const scrollerRect = chipScroller.getBoundingClientRect();
      const chipRect = chip.getBoundingClientRect();
      const pad = 24;
      let nextLeft = chipScroller.scrollLeft;
      if (chipRect.right > scrollerRect.right - pad) {
        nextLeft += chipRect.right - scrollerRect.right + pad;
      } else if (chipRect.left < scrollerRect.left + pad) {
        nextLeft -= scrollerRect.left + pad - chipRect.left;
      }
      const maxLeft = Math.max(
        0,
        chipScroller.scrollWidth - chipScroller.clientWidth,
      );
      chipScroller.scrollTo({
        left: Math.min(maxLeft, Math.max(0, nextLeft)),
        behavior: "smooth",
      });
    }
  }, []);

  const scrollCarouselBy = useCallback(
    (dir: -1 | 1) => {
      if (categories.length === 0) return;
      setActiveArrow(dir);
      const currentIndex = Math.max(
        0,
        categories.findIndex((category) => category.id === resolvedActiveId),
      );
      const nextIndex =
        (currentIndex + dir + categories.length) % categories.length;
      const next = categories[nextIndex];
      if (!next) return;
      selectCategory(next.id);
    },
    [categories, resolvedActiveId, selectCategory],
  );

  if (categories.length === 0) {
    return (
      <section
        id="categories"
        className="relative z-10 scroll-mt-28 rounded-t-[40px] bg-[#111] px-4 py-16 text-center text-white sm:px-6 lg:px-10"
      >
        <p className="text-sm text-white/70">{emptyLabel}</p>
      </section>
    );
  }

  return (
    <section
      id="categories"
      className="relative z-10 scroll-mt-28 overflow-hidden rounded-t-[40px] bg-[#111] pt-12 pb-14 text-white"
    >
      {/*
        Top category pills. End inset must be a flex child inside `w-max` —
        `padding-right` on the overflow scroller is ignored, so the last pill
        stays clipped.
      */}
      <div
        ref={chipScrollerRef}
        className="mb-12 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <MotionChipRow
          aria-label="Categories"
          className="flex w-max gap-2"
        >
          <span
            className="w-6 shrink-0 sm:w-10 lg:w-[51px]"
            aria-hidden
          />
          {categories.map((category) => {
            const isActive = category.id === resolvedActiveId;
            return (
              <MotionChip key={category.id}>
                <AppLink
                  ref={(node) => {
                    if (node) {
                      chipRefs.current.set(category.id, node);
                    } else {
                      chipRefs.current.delete(category.id);
                    }
                  }}
                  href={category.href}
                  prefetchPolicy="intent"
                  className={
                    isActive
                      ? "inline-block rounded-full bg-white px-6 py-[9px] text-sm leading-[21px] text-black"
                      : "inline-block rounded-full border border-white px-6 py-[9px] text-sm leading-[21px] text-white transition hover:bg-white/10"
                  }
                >
                  {category.title}
                </AppLink>
              </MotionChip>
            );
          })}
          <span
            className="w-6 shrink-0 sm:w-10 lg:w-[51px]"
            aria-hidden
          />
        </MotionChipRow>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory items-end gap-8 overflow-x-auto px-6 pb-8 sm:gap-11 sm:px-10 lg:px-[51px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => {
          return (
            <div
              key={category.id}
              ref={(node) => {
                if (node) {
                  cardRefs.current.set(category.id, node);
                } else {
                  cardRefs.current.delete(category.id);
                }
              }}
              className="w-[min(70vw,260px)] shrink-0 snap-center"
            >
              <AppLink
                href={category.href}
                prefetchPolicy="intent"
                className="group relative flex flex-col items-center"
                onFocus={() => setActiveId(category.id)}
              >
                <div className="relative h-[200px] w-full overflow-hidden sm:h-[229px]">
                  <Image
                    src={category.imageUrl ?? HOME_ASSETS.heroProduct}
                    alt={category.title}
                    fill
                    sizes="(max-width: 640px) 70vw, 260px"
                    className="object-contain object-bottom transition duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-7 line-clamp-2 min-h-[2.5rem] w-full self-stretch text-center text-sm leading-5 font-bold tracking-wide text-white uppercase sm:mt-8 sm:min-h-[3rem] sm:text-base sm:leading-6">
                  {category.title}
                </p>
              </AppLink>
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-center">
        <button
          type="button"
          aria-label={prevLabel}
          onClick={() => scrollCarouselBy(-1)}
          className="relative z-10 -mr-2.5 flex size-[58px] items-center justify-center"
        >
          <span className="inline-flex size-[41px] -scale-y-100 rotate-[135deg]">
            <Image
              src={
                activeArrow === -1
                  ? HOME_ASSETS.arrowYellow
                  : HOME_ASSETS.arrowGray
              }
              alt=""
              width={41}
              height={41}
              className="size-[41px]"
              aria-hidden
            />
          </span>
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          onClick={() => scrollCarouselBy(1)}
          className="relative z-0 flex size-[58px] items-center justify-center"
        >
          <span className="inline-flex size-[41px] rotate-[45deg]">
            <Image
              src={
                activeArrow === 1
                  ? HOME_ASSETS.arrowYellow
                  : HOME_ASSETS.arrowGray
              }
              alt=""
              width={41}
              height={41}
              className="size-[41px]"
              aria-hidden
            />
          </span>
        </button>
      </div>
    </section>
  );
}
