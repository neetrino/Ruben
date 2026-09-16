import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { RevealItem, RevealList } from "@/components/motion/RevealList";
import { ABOUT_ASSETS } from "@/features/about/content/about-assets";
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

const VALUE_ICON_SRC = ABOUT_ASSETS.values;

function valueIconSrc(id: string): string | null {
  if (id in VALUE_ICON_SRC) {
    return VALUE_ICON_SRC[id as keyof typeof VALUE_ICON_SRC];
  }
  return null;
}

function AboutValueCard({ value }: { value: AboutValue }) {
  const iconSrc = valueIconSrc(value.id);

  return (
    <article className="flex h-full w-full flex-col rounded-[24px] bg-black p-7 sm:rounded-[28px] sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <h3 className="min-w-0 text-lg font-bold uppercase text-brand sm:text-xl">
          {value.title}
        </h3>
        {iconSrc ? (
          <Image
            src={iconSrc}
            alt=""
            width={88}
            height={88}
            className="h-[72px] w-[72px] shrink-0 object-contain sm:h-[88px] sm:w-[88px]"
          />
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-[15px] sm:leading-7">
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

        <div className="flex flex-col gap-4">
          <RevealList className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {copy.values.slice(0, 3).map((value) => (
              <RevealItem key={value.id} className="min-w-0">
                <AboutValueCard value={value} />
              </RevealItem>
            ))}
          </RevealList>
          <RevealList className="mx-auto grid w-full grid-cols-1 gap-4 lg:w-2/3 lg:grid-cols-2">
            {copy.values.slice(3).map((value) => (
              <RevealItem key={value.id} className="min-w-0">
                <AboutValueCard value={value} />
              </RevealItem>
            ))}
          </RevealList>
        </div>
      </div>
    </section>
  );
}
