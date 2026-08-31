"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

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

const FALLBACK_IMAGES = [
  HOME_ASSETS.categorySink,
  HOME_ASSETS.categoryShower,
] as const;

function isWideCard(index: number): boolean {
  return index % 2 === 0;
}

export function HomeCategories({
  categories,
  emptyLabel,
  prevLabel,
  nextLabel,
}: HomeCategoriesProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const resolvedActiveId = categories.some((category) => category.id === activeId)
    ? activeId
    : (categories[0]?.id ?? "");

  const scrollCarouselBy = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.max(320, Math.round(el.clientWidth * 0.6));
    el.scrollBy({ left: dir * delta, behavior: "smooth" });
  }, []);

  const selectCategory = useCallback((id: string) => {
    setActiveId(id);
    const card = cardRefs.current.get(id);
    card?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, []);

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
      <div
        className="mb-12 flex gap-2 overflow-x-auto px-6 pt-1 sm:px-10 lg:px-[51px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Categories"
      >
        {categories.map((category) => {
          const isActive = category.id === resolvedActiveId;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => selectCategory(category.id)}
              className={
                isActive
                  ? "shrink-0 rounded-full bg-white px-6 py-[9px] text-sm leading-[21px] text-black"
                  : "shrink-0 rounded-full border border-white px-6 py-[9px] text-sm leading-[21px] text-white transition hover:bg-white/10"
              }
            >
              {category.title}
            </button>
          );
        })}
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory items-end gap-8 overflow-x-auto px-6 pb-8 sm:gap-11 sm:px-10 lg:px-[51px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category, index) => {
          const wide = isWideCard(index);
          const fallback =
            FALLBACK_IMAGES[index % FALLBACK_IMAGES.length] ??
            HOME_ASSETS.categorySink;
          const imageSrc = category.imageUrl ?? fallback;

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
              className={`shrink-0 snap-center ${
                wide ? "w-[min(78vw,345px)]" : "w-[min(40vw,137px)]"
              }`}
            >
              <AppLink
                href={category.href}
                prefetchPolicy="intent"
                className="group relative flex flex-col items-center"
                onFocus={() => setActiveId(category.id)}
              >
                <div
                  className={`relative w-full overflow-hidden ${
                    wide
                      ? "h-[200px] sm:h-[229px]"
                      : "mt-[18px] h-[180px] sm:h-[206px]"
                  }`}
                >
                  <Image
                    src={imageSrc}
                    alt={category.title}
                    fill
                    sizes={
                      wide
                        ? "(max-width: 640px) 78vw, 345px"
                        : "(max-width: 640px) 40vw, 137px"
                    }
                    className={
                      wide
                        ? "object-contain object-bottom transition duration-300 group-hover:scale-105"
                        : "object-cover object-center transition duration-300 group-hover:scale-105"
                    }
                  />
                </div>
                <p className="mt-4 text-center text-base font-bold leading-4 tracking-wide text-white uppercase">
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
              src={HOME_ASSETS.arrowGray}
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
              src={HOME_ASSETS.arrowYellow}
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
