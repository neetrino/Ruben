import Image from "next/image";

import { HOME_ASSETS } from "@/features/home/config/assets";
import { HomeFeatureIconMotion } from "@/features/home/ui/HomeFeatureIconMotion";
import type { HomeFeatureIconMotionKind } from "@/features/home/ui/home-feature-icon-motion";
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

const ICON_MOTION: Record<HomeFeatureIcon, HomeFeatureIconMotionKind> = {
  warranty: "float",
  delivery: "bounce",
  installment: "sway",
  original: "floatSoft",
};

type AnimatedFeatureIconProps = {
  icon: HomeFeatureIcon;
  sizes: string;
  className?: string;
  rotateClassName?: string;
};

function AnimatedFeatureIcon({
  icon,
  sizes,
  className = "object-contain",
  rotateClassName,
}: AnimatedFeatureIconProps) {
  return (
    <HomeFeatureIconMotion
      motion={ICON_MOTION[icon]}
      className="relative h-full w-full"
    >
      <div className={`relative h-full w-full ${rotateClassName ?? ""}`.trim()}>
        <Image
          src={FEATURE_ICONS[icon]}
          alt=""
          fill
          sizes={sizes}
          className={className}
        />
      </div>
    </HomeFeatureIconMotion>
  );
}

/**
 * Figma 118:1202 artboard 1440×1174 — positions as % of frame.
 * Cards: 151:356 warranty, 151:349 delivery, 151:342 installment, 151:366 original.
 */
const CARDS: Record<
  HomeFeatureIcon,
  {
    box: string;
    align: "text-left" | "text-right";
    titleTop: string;
    bodyTop: string;
  }
> = {
  warranty: {
    box: "left-[20.833%] top-[14.48%] h-[17.845%] w-[28.958%]",
    align: "text-left",
    titleTop: "top-[22%]",
    bodyTop: "top-[42%]",
  },
  delivery: {
    box: "left-[62.847%] top-[23.424%] h-[17.547%] w-[27.986%]",
    align: "text-right",
    titleTop: "top-[30.58%]",
    bodyTop: "top-[55.34%]",
  },
  installment: {
    box: "left-[9.097%] top-[37.819%] h-[16.78%] w-[29.097%]",
    align: "text-left",
    titleTop: "top-[23.35%]",
    bodyTop: "top-[43.15%]",
  },
  original: {
    box: "left-[57.917%] top-[46.593%] h-[17.291%] w-[30.903%]",
    align: "text-left",
    titleTop: "top-[25.86%]",
    bodyTop: "top-[62.81%]",
  },
};

const ORDER: HomeFeatureIcon[] = [
  "warranty",
  "delivery",
  "installment",
  "original",
];

export type { HomeFeatureIcon };

export function HomeFeatures({ items }: HomeFeaturesProps) {
  const byIcon = Object.fromEntries(
    items.map((item) => [item.icon, item]),
  ) as Record<HomeFeatureIcon, FeatureItem | undefined>;

  return (
    <section className="relative overflow-x-clip rounded-t-[40px] bg-[var(--brand-deep)]">
      {/* Mobile */}
      <div className="mx-auto flex max-w-lg flex-col gap-10 px-6 py-10 lg:hidden">
        <div className="relative mx-auto aspect-[557/453] w-full max-w-[557px] overflow-hidden">
          <div className="absolute top-[-70.86%] left-[-21.18%] h-[255.52%] w-[138.54%]">
            <Image
              src={HOME_ASSETS.featuresSink}
              alt=""
              fill
              sizes="557px"
              className="object-cover"
            />
          </div>
        </div>
        {ORDER.map((icon) => {
          const item = byIcon[icon];
          if (!item) return null;
          return (
            <article
              key={icon}
              className="relative rounded-[30px] bg-white px-12 pt-16 pb-10"
            >
              <div className="absolute -top-12 right-8 size-[120px]">
                <AnimatedFeatureIcon icon={icon} sizes="120px" />
              </div>
              <h3
                className={`whitespace-pre-line text-2xl leading-8 text-[#1a1c1c] uppercase ${CARDS[icon].align}`}
              >
                {item.title}
              </h3>
              <p
                className={`mt-3 whitespace-pre-line text-base leading-6 text-[#4c4546] ${CARDS[icon].align}`}
              >
                {item.description}
              </p>
            </article>
          );
        })}
      </div>

      {/* Desktop — Figma 1440×1174, cropped a bit top/bottom */}
      <div className="relative mx-auto hidden aspect-[1440/1000] w-full max-w-[1440px] overflow-hidden lg:block">
        <div className="absolute top-[-4%] left-0 aspect-[1440/1174] w-full">
        {/* 151:364 sink 414,256 557×453 */}
        <div className="absolute top-[21.806%] left-[28.75%] z-[1] h-[38.586%] w-[38.681%] overflow-hidden">
          <div className="absolute top-[-70.86%] left-[-21.18%] h-[255.52%] w-[138.54%]">
            <Image
              src={HOME_ASSETS.featuresSink}
              alt=""
              fill
              sizes="770px"
              className="object-cover"
            />
          </div>
        </div>

        {/* 151:365 reflection 370,675 687×254 */}
        <div className="pointer-events-none absolute top-[57.496%] left-[25.694%] z-[1] h-[21.635%] w-[47.708%] overflow-hidden mix-blend-color-burn">
          <div className="absolute top-[-304.69%] left-[-6.94%] h-[455.71%] w-[112.32%]">
            <Image
              src={HOME_ASSETS.featuresSink}
              alt=""
              fill
              sizes="770px"
              className="object-cover"
            />
          </div>
        </div>

        {ORDER.map((icon) => {
          const item = byIcon[icon];
          if (!item) return null;
          const card = CARDS[icon];
          const aboveSink = icon === "original";
          return (
            <article
              key={icon}
              className={`absolute rounded-[30px] bg-white ${card.box} ${
                aboveSink ? "z-[4]" : "z-0"
              }`}
            >
              {/* Shield is nested on warranty card in Figma 118:1206 */}
              {icon === "warranty" ? (
                <div className="pointer-events-none absolute top-[-31.6%] left-[51.03%] z-10 h-[88.78%] w-[44.6%]">
                  <AnimatedFeatureIcon icon="warranty" sizes="186px" />
                </div>
              ) : null}
              <h3
                className={`absolute right-12 left-12 ${card.titleTop} whitespace-pre-line text-2xl leading-8 text-[#1a1c1c] uppercase ${card.align}`}
              >
                {item.title}
              </h3>
              <p
                className={`absolute right-12 left-12 ${card.bodyTop} whitespace-pre-line text-base leading-6 text-[#4c4546] ${card.align}`}
              >
                {item.description}
              </p>
            </article>
          );
        })}

        {/* 151:375 bolt — under sink with other cards */}
        <div className="pointer-events-none absolute top-[14.821%] left-[64.489%] z-0 h-[21.915%] w-[12.321%]">
          <AnimatedFeatureIcon
            icon="delivery"
            sizes="177px"
            rotateClassName="rotate-[2.43deg]"
          />
        </div>

        <div className="pointer-events-none absolute top-[30.92%] left-[21.528%] z-0 h-[16.099%] w-[10.486%]">
          <AnimatedFeatureIcon icon="installment" sizes="151px" />
        </div>

        <div className="pointer-events-none absolute top-[40.29%] left-[74.167%] z-[5] h-[17.376%] w-[14.167%]">
          <AnimatedFeatureIcon icon="original" sizes="204px" />
        </div>
        </div>
      </div>
    </section>
  );
}
