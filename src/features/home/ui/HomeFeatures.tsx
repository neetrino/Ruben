import Image from "next/image";

import { HOME_ASSETS } from "@/features/home/config/assets";
import type { HomeFeatureIcon } from "@/features/home/ui/feature-icons";

type FeatureItem = {
  icon: HomeFeatureIcon;
  title: string;
  description: string;
};

type HomeFeaturesProps = {
  items: readonly FeatureItem[];
};

const FEATURE_ICONS: Record<HomeFeatureIcon, string> = {
  warranty: HOME_ASSETS.featureIconShield,
  delivery: HOME_ASSETS.featureIconBolt,
  installment: HOME_ASSETS.featureIconCard,
  original: HOME_ASSETS.featureIconSeal,
};

const CARD_LAYOUT: Record<
  HomeFeatureIcon,
  { place: string; align: string; iconPlace: string }
> = {
  warranty: {
    place: "lg:col-start-1 lg:row-start-1 lg:justify-self-end lg:self-end",
    align: "text-left",
    iconPlace: "right-4 -top-16",
  },
  delivery: {
    place: "lg:col-start-3 lg:row-start-1 lg:justify-self-start lg:self-center",
    align: "text-right",
    iconPlace: "left-4 -top-16",
  },
  installment: {
    place: "lg:col-start-1 lg:row-start-2 lg:justify-self-start lg:self-start",
    align: "text-left",
    iconPlace: "right-6 -top-14",
  },
  original: {
    place: "lg:col-start-3 lg:row-start-2 lg:justify-self-end lg:self-start",
    align: "text-left",
    iconPlace: "right-4 -top-16",
  },
};

export type { HomeFeatureIcon };

export function HomeFeatures({ items }: HomeFeaturesProps) {
  return (
    <section className="rounded-t-[40px] bg-[var(--brand-deep)] pt-16 pb-28 sm:pt-24 sm:pb-36">
      <div className="relative mx-auto grid max-w-[1440px] gap-8 px-6 sm:px-10 lg:grid-cols-3 lg:grid-rows-2 lg:gap-x-6 lg:gap-y-10 lg:px-[51px]">
        <div className="relative order-first mx-auto flex w-full max-w-md items-center justify-center lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none">
          <div className="pointer-events-none absolute inset-x-8 bottom-8 top-1/3 rounded-[50%] bg-[var(--brand)]/40 blur-2xl" />
          <Image
            src={HOME_ASSETS.featuresSink}
            alt=""
            width={557}
            height={453}
            className="relative z-10 h-auto w-full max-w-[420px] object-contain drop-shadow-xl lg:max-w-[520px]"
          />
        </div>

        {items.map((item) => {
          const layout = CARD_LAYOUT[item.icon];
          return (
            <article
              key={item.title}
              className={`relative rounded-[30px] bg-white px-8 py-10 shadow-sm ${layout.place}`}
            >
              <div
                className={`absolute ${layout.iconPlace} size-[120px] sm:size-[150px]`}
              >
                <Image
                  src={FEATURE_ICONS[item.icon]}
                  alt=""
                  fill
                  sizes="150px"
                  className="object-contain"
                />
              </div>
              <h3
                className={`text-xl font-medium tracking-wide text-[#1a1c1c] uppercase sm:text-2xl ${layout.align}`}
              >
                {item.title}
              </h3>
              <p
                className={`mt-3 text-base leading-6 text-[#4c4546] ${layout.align}`}
              >
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
