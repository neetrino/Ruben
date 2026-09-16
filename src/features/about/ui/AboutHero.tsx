import { Reveal } from "@/components/motion/Reveal";
import { AppLink } from "@/components/ui/AppLink";
import { AboutHeroPhoto } from "@/features/about/ui/AboutHeroPhoto";
import {
  ABOUT_CONTAINER_CLASS,
  ABOUT_HERO_FRAME_CLASS,
  ABOUT_MOBILE_PRIMARY_CTA_CLASS,
} from "@/features/about/ui/about-styles";
import { HomeArrowCta } from "@/features/home/ui/HomeArrowCta";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type AboutHeroProps = {
  copy: Dictionary["about"];
  catalogHref: string;
  contactHref: string;
};

/**
 * About hero photo. Arrow CTAs on the image from `lg` up; equal pills below on mobile.
 */
export function AboutHero({ copy, catalogHref, contactHref }: AboutHeroProps) {
  return (
    <div className="flex flex-col gap-4">
      <section className={`isolate ${ABOUT_HERO_FRAME_CLASS}`}>
        <AboutHeroPhoto alt={copy.heroImageAlt} />
        <h1 className="sr-only">{copy.heroTitle}</h1>

        <div
          className={`${ABOUT_CONTAINER_CLASS} absolute inset-0 z-10 hidden flex-col justify-end pt-16 pb-8 sm:pt-20 sm:pb-10 lg:flex lg:pb-12`}
        >
          <Reveal
            mode="mount"
            className="flex shrink-0 flex-wrap gap-3 self-end"
          >
            <HomeArrowCta
              href={catalogHref}
              label={copy.catalogCta}
              tone="brand"
            />
            <HomeArrowCta
              href={contactHref}
              label={copy.contactCta}
              tone="ghost"
            />
          </Reveal>
        </div>
      </section>

      <Reveal mode="mount" className="flex flex-row gap-3 px-2 lg:hidden">
        <AppLink
          href={catalogHref}
          prefetchPolicy="intent"
          className={ABOUT_MOBILE_PRIMARY_CTA_CLASS}
        >
          {copy.catalogCta}
        </AppLink>
        <HomeArrowCta
          href={contactHref}
          label={copy.contactCta}
          tone="dark"
          labelCentered
          className="min-w-0 flex-1 basis-0 px-3 text-[13px] sm:px-4 sm:text-sm"
        />
      </Reveal>
    </div>
  );
}
