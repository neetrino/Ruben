import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { HOME_ASSETS } from "@/features/home/config/assets";
import { HomeArrowCta } from "@/features/home/ui/HomeArrowCta";
import { HomeFeatureIconMotion } from "@/features/home/ui/HomeFeatureIconMotion";
import type { HomeFeatureIconMotionKind } from "@/features/home/ui/home-feature-icon-motion";
import type { HomeFeatureIcon } from "@/features/home/ui/feature-icons";

type FeatureItem = {
  icon: HomeFeatureIcon;
  title: string;
  description: string;
};

type HomeFeaturesProps = {
  title: string;
  viewAllLabel: string;
  viewAllHref: string;
  items: readonly FeatureItem[];
};

const FEATURE_ICONS: Record<HomeFeatureIcon, string> = {
  warranty: HOME_ASSETS.featureIconShield,
  delivery: HOME_ASSETS.featureIconBolt,
  installment: HOME_ASSETS.featureIconCard,
  original: HOME_ASSETS.featureIconSeal,
};

const ICON_MOTION: Record<HomeFeatureIcon, HomeFeatureIconMotionKind> = {
  warranty: "float",
  delivery: "bounce",
  installment: "sway",
  original: "floatSoft",
};

const ORDER: HomeFeatureIcon[] = [
  "warranty",
  "delivery",
  "installment",
  "original",
];

type AnimatedFeatureIconProps = {
  icon: HomeFeatureIcon;
};

const ICON_BOX_CLASS: Record<HomeFeatureIcon, string> = {
  warranty: "top-[-72px] size-60",
  delivery: "top-[-72px] size-60",
  installment: "top-[-96px] size-[300px]",
  original: "top-[-72px] size-60",
};

function AnimatedFeatureIcon({ icon }: AnimatedFeatureIconProps) {
  return (
    <HomeFeatureIconMotion
      motion={ICON_MOTION[icon]}
      className="relative h-full w-full"
    >
      <Image
        src={FEATURE_ICONS[icon]}
        alt=""
        fill
        sizes={icon === "installment" ? "300px" : "240px"}
        unoptimized
        className="object-contain"
      />
    </HomeFeatureIconMotion>
  );
}

export type { HomeFeatureIcon };

/**
 * Figma 118:1202 — “Why choose us” gradient band with four feature cards.
 */
export function HomeFeatures({
  title,
  viewAllLabel,
  viewAllHref,
  items,
}: HomeFeaturesProps) {
  const byIcon = Object.fromEntries(
    items.map((item) => [item.icon, item]),
  ) as Record<HomeFeatureIcon, FeatureItem | undefined>;

  return (
    <section className="relative overflow-x-clip rounded-t-[40px] bg-gradient-to-b from-[#111] to-[#987602]">
      <div className="mx-auto max-w-[1440px] px-6 pt-[100px] pb-40 sm:px-10 lg:px-[69px]">
        <Reveal className="flex items-center justify-between gap-6">
          <h2 className="text-2xl leading-8 font-bold text-white uppercase">
            {title}
          </h2>
          <HomeArrowCta
            href={viewAllHref}
            label={viewAllLabel}
            tone="light"
            className="shrink-0"
          />
        </Reveal>

        <ul className="mt-[110px] flex flex-wrap justify-center gap-[27px]">
          {ORDER.map((icon) => {
            const item = byIcon[icon];
            if (!item) return null;

            return (
              <Reveal
                key={icon}
                as="li"
                className="relative w-full max-w-[305px] shrink-0 rounded-[40px] bg-white px-8 pt-[168px] pb-10 sm:w-[305px]"
              >
                <div
                  className={`pointer-events-none absolute left-1/2 -translate-x-1/2 ${ICON_BOX_CLASS[icon]}`}
                >
                  <AnimatedFeatureIcon icon={icon} />
                </div>
                <h3 className="text-center text-2xl leading-8 font-semibold text-[#1a1c1c] uppercase">
                  <span className="whitespace-pre-line">{item.title}</span>
                </h3>
                <p className="mx-auto mt-4 max-w-[226px] text-center text-base leading-6 text-[#4c4546]">
                  <span className="whitespace-pre-line">{item.description}</span>
                </p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
