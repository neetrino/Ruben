import { Award, Handshake, LayoutGrid, ShieldCheck, Sparkles } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { RevealItem, RevealList } from "@/components/motion/RevealList";
import {
  ABOUT_CARD_CLASS,
  ABOUT_CONTAINER_CLASS,
  ABOUT_H2_CLASS,
} from "@/features/about/ui/about-styles";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type AboutValuesProps = {
  copy: Dictionary["about"];
};

type AboutValue = Dictionary["about"]["values"][number];

const VALUE_ICON_CLASS = "h-5 w-5 text-brand";

function ValueIcon({ id }: { id: string }) {
  switch (id) {
    case "quality":
      return <Award className={VALUE_ICON_CLASS} aria-hidden />;
    case "trust":
      return <ShieldCheck className={VALUE_ICON_CLASS} aria-hidden />;
    case "choice":
      return <LayoutGrid className={VALUE_ICON_CLASS} aria-hidden />;
    case "professional":
      return <Handshake className={VALUE_ICON_CLASS} aria-hidden />;
    case "growth":
      return <Sparkles className={VALUE_ICON_CLASS} aria-hidden />;
    default:
      return null;
  }
}

function AboutValueCard({
  value,
  index,
}: {
  value: AboutValue;
  index: number;
}) {
  return (
    <article className="h-full rounded-[24px] border border-black/[0.06] bg-[#f7f7f7] p-7 sm:rounded-[28px]">
      <div className="flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-full bg-brand text-xs font-bold text-black">
          {String(index + 1).padStart(2, "0")}
        </span>
        <ValueIcon id={value.id} />
      </div>
      <h3 className="mt-6 text-lg font-bold text-black sm:text-xl">
        {value.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-black/70 sm:text-[15px] sm:leading-7">
        {value.description}
      </p>
    </article>
  );
}

export function AboutValues({ copy }: AboutValuesProps) {
  return (
    <section className={`bg-white py-16 sm:py-20 lg:py-24 ${ABOUT_CARD_CLASS}`}>
      <div className={ABOUT_CONTAINER_CLASS}>
        <Reveal className="mb-10 max-w-2xl">
          <h2 className={ABOUT_H2_CLASS}>{copy.valuesTitle}</h2>
          <div className="mt-5 h-1 w-14 rounded-full bg-brand" aria-hidden />
        </Reveal>

        <RevealList
          as="ul"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {copy.values.map((value, index) => (
            <RevealItem as="li" key={value.id}>
              <AboutValueCard value={value} index={index} />
            </RevealItem>
          ))}
        </RevealList>
      </div>
    </section>
  );
}
