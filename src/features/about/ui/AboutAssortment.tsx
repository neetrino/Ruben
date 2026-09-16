import { Reveal } from "@/components/motion/Reveal";
import {
  ABOUT_BODY_CLASS,
  ABOUT_CARD_CLASS,
  ABOUT_CONTAINER_CLASS,
  ABOUT_EYEBROW_CLASS,
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
            <p className={`${ABOUT_EYEBROW_CLASS} mb-5`}>
              {copy.assortmentLead}
            </p>
            <ul className="flex flex-wrap gap-2.5">
              {copy.assortmentItems.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-black/10 bg-[#f7f7f7] px-4 py-2.5 text-sm font-medium text-black"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
