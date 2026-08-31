"use client";

import Image from "next/image";

import { HomeArrowCta } from "@/features/home/ui/HomeArrowCta";
import { HOME_ASSETS } from "@/features/home/config/assets";
import type { StorefrontHeroSlide } from "@/features/hero/application/queries";

type HomeHeroProps = {
  slides: StorefrontHeroSlide[];
  brandName: string;
  fallbackSubtitle: string;
  fallbackCtaLabel: string;
  fallbackCtaHref: string;
};

function isInternalHref(href: string): boolean {
  return href.startsWith("/");
}

export function HomeHero({
  slides,
  brandName,
  fallbackSubtitle,
  fallbackCtaLabel,
  fallbackCtaHref,
}: HomeHeroProps) {
  const active = slides[0] ?? null;
  const subtitle = active?.copy.subtitle ?? fallbackSubtitle;
  const ctaLabel = active?.copy.buttonLabel ?? fallbackCtaLabel;
  const ctaHref = active?.copy.buttonUrl ?? fallbackCtaHref;

  return (
    <section className="relative z-0 bg-white pt-0 pb-12 sm:pb-20 lg:min-h-[820px] lg:pb-8">
      {/*
        Figma Vector 7 — under product, continues under categories.
      */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 mx-auto hidden max-w-[1440px] md:block"
        aria-hidden
      >
        <Image
          src={HOME_ASSETS.heroWave}
          alt=""
          width={1370}
          height={1380}
          priority
          className="absolute top-[-120px] left-[157px] h-auto w-[1369px] max-w-none select-none"
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-start gap-4 px-6 sm:px-10 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-center lg:gap-0 lg:px-[105px]">
        <div className="relative z-20 max-w-xl pt-1 lg:pt-3">
          <h1 className="sr-only">{brandName}</h1>
          <Image
            src={HOME_ASSETS.logo}
            alt={brandName}
            width={406}
            height={248}
            priority
            className="h-auto w-[min(100%,320px)] sm:w-[min(100%,406px)]"
          />

          <div className="mt-6 border-l-[6px] border-[var(--brand)] pl-7 sm:mt-8">
            <p className="max-w-[36rem] text-base leading-7 text-neutral-800 sm:text-lg sm:leading-8">
              {subtitle}
            </p>
          </div>

          <div className="mt-6 sm:mt-8">
            {isInternalHref(ctaHref) ? (
              <HomeArrowCta href={ctaHref} label={ctaLabel} />
            ) : (
              <a
                href={ctaHref}
                className="inline-flex h-12 items-center gap-4 rounded-full bg-black py-3 pr-3 pl-6 text-base font-bold tracking-wide text-white uppercase transition hover:bg-neutral-900"
              >
                <span>{ctaLabel}</span>
                <Image
                  src={HOME_ASSETS.arrowCta}
                  alt=""
                  width={41}
                  height={41}
                  className="size-[41px] shrink-0"
                  aria-hidden
                />
              </a>
            )}
          </div>
        </div>

        {/* Mobile / tablet — product in flow */}
        <div className="relative z-20 mx-auto aspect-square w-full max-w-[560px] sm:max-w-[640px] lg:hidden">
          <Image
            src={HOME_ASSETS.heroProduct}
            alt=""
            fill
            priority
            sizes="90vw"
            className="object-contain object-right drop-shadow-[0_18px_35px_rgba(0,0,0,0.14)]"
            aria-hidden
          />
        </div>

        {/* Desktop spacer so grid keeps height while art is absolute */}
        <div className="hidden lg:block lg:h-[700px]" aria-hidden />
      </div>

      {/*
        Figma 118:912 / 118:913 — product pinned to the right frame edge so the
        handle (ручка) sits flush with the artboard cutout.
      */}
      <div
        className="pointer-events-none absolute top-[100px] right-0 z-20 hidden h-[759px] w-[759px] lg:block"
        aria-hidden
      >
        <Image
          src={HOME_ASSETS.heroProduct}
          alt=""
          fill
          priority
          sizes="759px"
          className="object-cover object-right drop-shadow-[0_18px_35px_rgba(0,0,0,0.14)]"
        />
      </div>
    </section>
  );
}
