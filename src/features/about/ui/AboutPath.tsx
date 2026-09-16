import { Reveal } from "@/components/motion/Reveal";
import {
  ABOUT_CARD_CLASS,
  ABOUT_CONTAINER_CLASS,
  ABOUT_H2_LIGHT_CLASS,
} from "@/features/about/ui/about-styles";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type AboutPathProps = {
  copy: Dictionary["about"];
};

type PathItem = Dictionary["about"]["path"][number];

function AboutPathStep({ item }: { item: PathItem }) {
  return (
    <article className="group relative rounded-[24px] border border-white/[0.08] bg-white/[0.03] px-5 py-6 transition duration-300 hover:border-brand/30 hover:bg-white/[0.05] sm:rounded-[28px] sm:px-7 sm:py-7">
      <div className="flex items-start gap-4 sm:gap-5 lg:gap-6">
        <span
          className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-[3px] border-brand bg-black sm:size-9"
          aria-hidden
        >
          <span className="size-2.5 rounded-full bg-brand" />
        </span>
        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(13.5rem,16rem)_minmax(0,1fr)] sm:items-start sm:gap-10 lg:gap-12">
          <p className="flex min-h-8 items-center text-[clamp(1.15rem,2.2vw,1.75rem)] leading-none font-black tracking-tight text-brand sm:min-h-9">
            {item.label}
          </p>
          <p className="min-w-0 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-[15px] sm:leading-7">
            {item.text}
          </p>
        </div>
      </div>
    </article>
  );
}

export function AboutPath({ copy }: AboutPathProps) {
  return (
    <section
      className={`bg-black py-16 sm:py-20 lg:py-24 ${ABOUT_CARD_CLASS}`}
    >
      <div className={ABOUT_CONTAINER_CLASS}>
        <Reveal>
          <h2 className={ABOUT_H2_LIGHT_CLASS}>{copy.pathTitle}</h2>
          <div className="mt-5 h-1 w-14 rounded-full bg-brand" aria-hidden />
        </Reveal>

        <div className="relative mt-12 space-y-5 lg:mt-14 lg:space-y-6">
          <div
            className="absolute top-8 bottom-8 left-[36px] w-[2px] rounded-full bg-brand/30 sm:left-[46px]"
            aria-hidden
          />
          {copy.path.map((item) => (
            <Reveal key={item.label}>
              <AboutPathStep item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
