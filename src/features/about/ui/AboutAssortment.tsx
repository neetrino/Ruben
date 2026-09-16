import { Reveal } from "@/components/motion/Reveal";
import {
  ABOUT_BODY_CLASS,
  ABOUT_CARD_CLASS,
  ABOUT_CONTAINER_CLASS,
  ABOUT_H2_CLASS,
} from "@/features/about/ui/about-styles";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type AboutAssortmentProps = {
  copy: Dictionary["about"];
};

export function AboutAssortment({ copy }: AboutAssortmentProps) {
  return (
    <section className={`bg-white py-16 sm:py-20 lg:py-24 ${ABOUT_CARD_CLASS}`}>
      <div className={ABOUT_CONTAINER_CLASS}>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className={ABOUT_H2_CLASS}>{copy.assortmentTitle}</h2>
            <div
              className="mt-5 h-1 w-14 rounded-full bg-brand"
              aria-hidden
            />
            <p className={`${ABOUT_BODY_CLASS} mt-6`}>{copy.assortmentIntro}</p>
            <p className="mt-8 border-l-[6px] border-brand pl-5 text-sm leading-relaxed font-medium text-black sm:text-[15px] sm:leading-7">
              {copy.assortmentClosing}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-[24px] bg-[#1a1a1a] px-5 py-5 sm:rounded-[28px] sm:px-6 sm:py-6">
              <p className="text-xs font-bold tracking-[0.08em] text-brand uppercase sm:text-sm">
                {copy.assortmentLead}
              </p>
              <ul className="mt-3.5 space-y-2 sm:mt-4 sm:space-y-2.5">
                {copy.assortmentItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-white/90 sm:leading-6"
                  >
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
