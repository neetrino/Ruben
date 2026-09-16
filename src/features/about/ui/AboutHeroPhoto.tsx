import Image from "next/image";

import { ABOUT_ASSETS } from "@/features/about/content/about-assets";

type AboutHeroPhotoProps = {
  alt: string;
};

export function AboutHeroPhoto({ alt }: AboutHeroPhotoProps) {
  return (
    <>
      <div className="absolute inset-0">
        <Image
          src={ABOUT_ASSETS.storefront}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[80%_70%]"
        />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25"
        aria-hidden
      />
    </>
  );
}
