import { AboutAssortment } from "@/features/about/ui/AboutAssortment";
import { AboutDivider } from "@/features/about/ui/AboutDivider";
import { AboutHero } from "@/features/about/ui/AboutHero";
import { AboutPath } from "@/features/about/ui/AboutPath";
import { AboutStory } from "@/features/about/ui/AboutStory";
import { AboutValues } from "@/features/about/ui/AboutValues";
import { AboutVision } from "@/features/about/ui/AboutVision";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type AboutViewProps = {
  locale: Locale;
  copy: Dictionary["about"];
};

/**
 * Storefront About page — grill.am-style stacked cards and photo hero.
 */
export function AboutView({ locale, copy }: AboutViewProps) {
  const catalogHref = `/${locale}/products`;
  const contactHref = `/${locale}/contact`;

  return (
    <div className="about-page-root relative z-0 -mx-4 -mt-2 min-h-full bg-white px-4 pt-1 pb-3 sm:-mx-6 sm:px-5 sm:pt-2 sm:pb-4 lg:-mx-8 lg:-mb-10 lg:px-4 lg:pt-2 lg:pb-5">
      <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
        <AboutHero
          copy={copy}
          catalogHref={catalogHref}
          contactHref={contactHref}
        />
        <AboutDivider />
        <AboutStory copy={copy} />
        <AboutDivider />
        <AboutPath copy={copy} />
        <AboutDivider />
        <AboutAssortment copy={copy} />
        <AboutDivider />
        <AboutValues copy={copy} />
        <AboutDivider />
        <AboutVision copy={copy} catalogHref={catalogHref} />
      </div>
    </div>
  );
}
