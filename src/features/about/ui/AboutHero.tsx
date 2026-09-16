import { Reveal } from "@/components/motion/Reveal";
import { AppLink } from "@/components/ui/AppLink";
import { AboutHeroPhoto } from "@/features/about/ui/AboutHeroPhoto";
import {
  ABOUT_CARD_CLASS,
  ABOUT_CONTAINER_CLASS,
  ABOUT_GHOST_CTA_CLASS,
  ABOUT_H1_CLASS,
  ABOUT_HERO_MIN_HEIGHT_CLASS,
  ABOUT_PRIMARY_CTA_CLASS,
} from "@/features/about/ui/about-styles";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type AboutHeroProps = {
  copy: Dictionary["about"];
  catalogHref: string;
  contactHref: string;
};

export function AboutHero({ copy, catalogHref, contactHref }: AboutHeroProps) {
  return (
    <section
      className={`relative isolate ${ABOUT_HERO_MIN_HEIGHT_CLASS} bg-black ${ABOUT_CARD_CLASS}`}
    >
      <AboutHeroPhoto alt={copy.heroImageAlt} />

      <div
        className={`${ABOUT_CONTAINER_CLASS} relative z-10 flex ${ABOUT_HERO_MIN_HEIGHT_CLASS} flex-col justify-end pt-20 pb-10 sm:pt-24 sm:pb-12 lg:pt-28 lg:pb-14`}
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <Reveal mode="mount" className="max-w-xl">
            <h1 className={ABOUT_H1_CLASS}>{copy.heroTitle}</h1>
            <p className="mt-3 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
              {copy.heroLead}
            </p>
          </Reveal>
          <Reveal
            mode="mount"
            delay={0.08}
            className="flex shrink-0 flex-wrap gap-3 self-end lg:justify-end"
          >
            <AppLink
              href={catalogHref}
              prefetchPolicy="intent"
              className={ABOUT_PRIMARY_CTA_CLASS}
            >
              {copy.catalogCta}
            </AppLink>
            <AppLink
              href={contactHref}
              prefetchPolicy="intent"
              className={ABOUT_GHOST_CTA_CLASS}
            >
              {copy.contactCta}
            </AppLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
