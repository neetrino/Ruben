import { Reveal } from "@/components/motion/Reveal";
import {
  ABOUT_BODY_CLASS,
  ABOUT_CARD_CLASS,
  ABOUT_CONTAINER_CLASS,
  ABOUT_H2_CLASS,
} from "@/features/about/ui/about-styles";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type AboutStoryProps = {
  copy: Dictionary["about"];
};

function StoryParagraph({
  index,
  text,
}: {
  index: number;
  text: string;
}) {
  return (
    <div className="flex gap-4 sm:gap-5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-black sm:size-11 sm:text-sm">
        {String(index + 1).padStart(2, "0")}
      </span>
      <p className={`pt-1.5 sm:pt-2 ${ABOUT_BODY_CLASS}`}>{text}</p>
    </div>
  );
}

export function AboutStory({ copy }: AboutStoryProps) {
  return (
    <section className={`relative bg-white py-16 sm:py-20 lg:py-24 ${ABOUT_CARD_CLASS}`}>
      <div className={ABOUT_CONTAINER_CLASS}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.44fr)_1px_minmax(0,0.56fr)] lg:items-start lg:gap-14">
          <Reveal>
            <h2 className={`max-w-md ${ABOUT_H2_CLASS}`}>{copy.storyEyebrow}</h2>
            <div
              className="mt-5 h-1 w-14 rounded-full bg-brand sm:mt-6"
              aria-hidden
            />
            <div className="relative mt-12 flex items-end gap-3 sm:mt-14">
              <span className="text-[clamp(3.75rem,9vw,5.25rem)] leading-none font-black text-brand">
                {copy.statValue}
              </span>
              <span className="pb-1.5 text-sm font-bold tracking-[0.16em] text-black uppercase sm:pb-2">
                {copy.statLabel}
              </span>
            </div>
            <div
              className="mt-8 h-[3px] w-32 rounded-full bg-gradient-to-r from-brand to-black/70 sm:mt-10 sm:w-36"
              aria-hidden
            />
          </Reveal>

          <div
            className="hidden bg-brand/30 lg:block lg:min-h-full lg:w-px lg:justify-self-center"
            aria-hidden
          />
          <div className="h-px bg-brand/30 lg:hidden" aria-hidden />

          <Reveal delay={0.08} className="space-y-8 sm:space-y-9 lg:pt-1">
            {copy.intro.map((paragraph, index) => (
              <StoryParagraph key={paragraph} index={index} text={paragraph} />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
