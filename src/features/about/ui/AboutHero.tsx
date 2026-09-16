import { Reveal } from "@/components/motion/Reveal";
import { AppLink } from "@/components/ui/AppLink";
import { AboutHeroPhoto } from "@/features/about/ui/AboutHeroPhoto";
import {
  ABOUT_CONTAINER_CLASS,
  ABOUT_GHOST_CTA_CLASS,
  ABOUT_HERO_FRAME_CLASS,
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
    <section className={`isolate ${ABOUT_HERO_FRAME_CLASS}`}>
      <AboutHeroPhoto alt={copy.heroImageAlt} />
      <h1 className="sr-only">{copy.heroTitle}</h1>

      <div
        className={`${ABOUT_CONTAINER_CLASS} absolute inset-0 z-10 flex flex-col justify-end pt-16 pb-8 sm:pt-20 sm:pb-10 lg:pb-12`}
      >
        <Reveal
          mode="mount"
          className="flex shrink-0 flex-wrap gap-3 self-end"
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
    </section>
  );
}
