import Image from "next/image";

import { ABOUT_ASSETS } from "@/features/about/content/about-assets";

type AboutHeroPhotoProps = {
  alt: string;
};

/**
 * Figma 249:627 — sky photo, Vector 7 stroke, building cut-out on top so
 * the yellow line passes behind the facade.
 */
export function AboutHeroPhoto({ alt }: AboutHeroPhotoProps) {
  return (
    <>
      <div className="absolute inset-0">
        <Image
          src={ABOUT_ASSETS.heroBack}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>

      <div
        className="pointer-events-none absolute z-[1] flex items-center justify-center"
        style={{
          top: "-41.97%",
          right: "-0.86%",
          bottom: "-22.17%",
          left: "3.96%",
        }}
        aria-hidden
      >
        {/* Figma 249:629 — 1339×505 path rotated −45.38° into the vector box. */}
        <img
          src={ABOUT_ASSETS.heroWave}
          alt=""
          width={1339}
          height={505}
          className="max-w-none origin-center select-none"
          style={{
            width: "min(1288px, 105%)",
            height: "auto",
            aspectRatio: "1339 / 505",
            transform: "rotate(-45.38deg)",
          }}
        />
      </div>

      <div
        className="absolute z-[2] overflow-hidden rounded-[56px]"
        style={{
          top: "4.41%",
          left: "25.81%",
          width: "74.59%",
          height: "97.34%",
        }}
        aria-hidden
      >
        <img
          src={ABOUT_ASSETS.heroFront}
          alt=""
          width={1280}
          height={853}
          className="absolute max-w-none"
          style={{
            width: "135.45%",
            height: "116.37%",
            left: "-35.45%",
            top: "-4.64%",
          }}
        />
      </div>
    </>
  );
}
