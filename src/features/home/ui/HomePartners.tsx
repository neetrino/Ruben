import Image from "next/image";

import { RevealItem, RevealList } from "@/components/motion/RevealList";
import type { StorefrontBrandItem } from "@/features/brands/application/list-storefront-brands";

type HomePartnersProps = {
  brands: readonly StorefrontBrandItem[];
  title?: string;
};

/**
 * White partners strip — brand logos/names from admin CMS.
 * Renders nothing when there are no published brands.
 */
export function HomePartners({ brands, title }: HomePartnersProps) {
  const marks = brands.slice(0, 4);
  if (marks.length === 0) {
    return null;
  }

  return (
    <section
      id="partners"
      className="relative z-10 -mt-12 flex min-h-[200px] flex-col items-center justify-center rounded-t-[40px] bg-white sm:-mt-16 sm:min-h-[280px] lg:min-h-[400px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-center px-6 sm:px-10 lg:px-[138px]">
        {title ? <h2 className="sr-only">{title}</h2> : null}
        <RevealList
          as="ul"
          className="flex w-full flex-wrap items-center justify-center gap-x-16 gap-y-8 sm:gap-x-24 lg:justify-evenly lg:gap-x-0"
        >
          {marks.map((brand) => (
            <RevealItem
              as="li"
              key={brand.id}
              className="flex shrink-0 items-center"
            >
              {brand.imageUrl ? (
                <Image
                  src={brand.imageUrl}
                  alt={brand.title}
                  width={200}
                  height={64}
                  className="h-10 w-auto max-w-[160px] object-contain sm:h-12 lg:h-14"
                />
              ) : (
                <span className="text-center text-[22px] leading-tight font-bold text-[#111] uppercase sm:text-[32px] lg:text-[44px]">
                  {brand.title}
                </span>
              )}
            </RevealItem>
          ))}
        </RevealList>
      </div>
    </section>
  );
}
