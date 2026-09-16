import { Reveal } from "@/components/motion/Reveal";
import { AboutParagraphs } from "@/features/about/ui/AboutParagraphs";
import {
  ABOUT_CARD_CLASS,
  ABOUT_CONTAINER_CLASS,
  ABOUT_H2_LIGHT_CLASS,
} from "@/features/about/ui/about-styles";
import { HomeArrowCta } from "@/features/home/ui/HomeArrowCta";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type AboutVisionProps = {
  copy: Dictionary["about"];
  catalogHref: string;
};

export function AboutVision({ copy, catalogHref }: AboutVisionProps) {
  return (
    <section className={`bg-black py-16 text-white sm:py-20 lg:py-24 ${ABOUT_CARD_CLASS}`}>
      <div className={ABOUT_CONTAINER_CLASS}>
        <Reveal className="max-w-3xl">
          <h2 className={ABOUT_H2_LIGHT_CLASS}>{copy.visionTitle}</h2>
          <div className="mt-5 h-1 w-14 rounded-full bg-brand" aria-hidden />
          <div className="mt-8">
            <AboutParagraphs
              paragraphs={copy.vision}
              className="text-sm leading-relaxed text-white/75 sm:text-[15px] sm:leading-7"
            />
          </div>
        </Reveal>

        <Reveal
          delay={0.08}
          className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-12"
        >
          <div>
            <p className="text-lg font-bold text-brand">{copy.brandName}</p>
            <ul className="mt-4 space-y-1">
              {copy.taglines.map((line) => (
                <li key={line} className="text-sm text-white/80 sm:text-[15px]">
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <HomeArrowCta
            href={catalogHref}
            label={copy.catalogCta}
            tone="brand"
            className="self-end shrink-0"
          />
        </Reveal>
      </div>
    </section>
  );
}
