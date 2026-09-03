"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";

import { AppLink } from "@/components/ui/AppLink";
import { HOME_MOBILE_ASSETS } from "@/features/home/config/assets";
import { HomeMobileHeroCarousel } from "@/features/home/ui/HomeMobileHeroCarousel";
import { catalogHref } from "@/features/products/domain/catalog-url";
import { DEFAULT_CATALOG_FILTERS } from "@/features/products/schemas/catalog-list";
import { CATALOG_ASSETS } from "@/features/products/ui/catalog-assets";
import type { StorefrontHeroSlide } from "@/features/hero/application/queries";
import type { Locale } from "@/lib/i18n/config";

export type HomeMobileCategoryChip = {
  id: string;
  title: string;
  href: string;
};

type HomeMobileHeroProps = {
  locale: Locale;
  brandName: string;
  slides: StorefrontHeroSlide[];
  categories: readonly HomeMobileCategoryChip[];
  allCategoriesLabel: string;
  searchPlaceholder: string;
  searchSubmitLabel: string;
  filtersLabel: string;
  locationLabel: string;
  callLabel: string;
  phoneHref: string;
  locationHref: string;
  prevSlideLabel: string;
  nextSlideLabel: string;
  fallbackImageSrc: string;
};

function chipIconSrc(index: number): string {
  const icons = CATALOG_ASSETS.chipIcons;
  return icons[index % icons.length] ?? HOME_MOBILE_ASSETS.chipBathtub;
}

/**
 * Mobile home top chrome + hero carousel (Figma 171:562).
 * Shown below `lg`; desktop keeps {@link HomeHero}.
 */
export function HomeMobileHero({
  locale,
  brandName,
  slides,
  categories,
  allCategoriesLabel,
  searchPlaceholder,
  searchSubmitLabel,
  filtersLabel,
  locationLabel,
  callLabel,
  phoneHref,
  locationHref,
  prevSlideLabel,
  nextSlideLabel,
  fallbackImageSrc,
}: HomeMobileHeroProps) {
  const router = useRouter();
  const searchId = useId();
  const [query, setQuery] = useState("");
  const productsHref = `/${locale}/products`;
  const allHref = catalogHref(locale, DEFAULT_CATALOG_FILTERS, {
    category: undefined,
    page: 1,
  });

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(
      catalogHref(locale, DEFAULT_CATALOG_FILTERS, {
        q: trimmed || undefined,
        page: 1,
      }),
    );
  }

  return (
    <section className="relative bg-white px-[14px] pt-2.5 pb-6 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <AppLink
          href={`/${locale}`}
          prefetchPolicy="intent"
          className="relative block h-[52px] w-[85px] shrink-0"
          aria-label={brandName}
        >
          <Image
            src={HOME_MOBILE_ASSETS.logo}
            alt={brandName}
            fill
            priority
            sizes="85px"
            className="object-contain object-left"
          />
        </AppLink>

        <div className="flex items-center gap-[5px]">
          <a
            href={locationHref}
            aria-label={locationLabel}
            className="inline-flex size-12 items-center justify-center rounded-full bg-[var(--brand)]"
          >
            <Image
              src={HOME_MOBILE_ASSETS.location}
              alt=""
              width={22}
              height={27}
              className="h-[22px] w-[18px]"
              aria-hidden
            />
          </a>
          <a href={phoneHref} aria-label={callLabel} className="block size-12">
            <Image
              src={HOME_MOBILE_ASSETS.phone}
              alt=""
              width={48}
              height={48}
              className="size-12"
              aria-hidden
            />
          </a>
        </div>
      </div>

      <form
        onSubmit={onSearchSubmit}
        className="mt-5 flex items-center gap-3"
        role="search"
      >
        <label
          htmlFor={searchId}
          className="flex h-14 min-w-0 flex-1 items-center gap-2 rounded-full bg-[#f3f4f6] px-4"
        >
          <Image
            src={HOME_MOBILE_ASSETS.search}
            alt=""
            width={18}
            height={20}
            className="h-5 w-[18px] shrink-0 opacity-50"
            aria-hidden
          />
          <input
            id={searchId}
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-base text-neutral-800 outline-none placeholder:text-[#9ca3af]"
            autoComplete="off"
          />
          <span className="sr-only">{searchSubmitLabel}</span>
        </label>

        <AppLink
          href={productsHref}
          prefetchPolicy="intent"
          aria-label={filtersLabel}
          className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-black"
        >
          <Image
            src={HOME_MOBILE_ASSETS.filter}
            alt=""
            width={24}
            height={24}
            className="size-6"
            aria-hidden
          />
        </AppLink>
      </form>

      <div
        className="mt-5 flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label={allCategoriesLabel}
      >
        <AppLink
          href={allHref}
          prefetchPolicy="intent"
          role="listitem"
          className="inline-flex h-[41px] shrink-0 items-center gap-2 rounded-full bg-[var(--brand)] px-5 text-sm font-semibold text-[#1f1f1f]"
        >
          <Image
            src={HOME_MOBILE_ASSETS.menuAll}
            alt=""
            width={20}
            height={20}
            className="size-5"
            aria-hidden
          />
          {allCategoriesLabel}
        </AppLink>

        {categories.map((category, index) => (
          <AppLink
            key={category.id}
            href={category.href}
            prefetchPolicy="intent"
            role="listitem"
            className="inline-flex h-[41px] shrink-0 items-center gap-2 rounded-full border border-[rgba(31,31,31,0.26)] bg-white px-5 text-sm text-[#1f1f1f]"
          >
            <Image
              src={chipIconSrc(index)}
              alt=""
              width={20}
              height={20}
              className="size-5"
              aria-hidden
            />
            {category.title}
          </AppLink>
        ))}
      </div>

      <HomeMobileHeroCarousel
        brandName={brandName}
        slides={slides}
        prevSlideLabel={prevSlideLabel}
        nextSlideLabel={nextSlideLabel}
        fallbackImageSrc={fallbackImageSrc}
      />
    </section>
  );
}
