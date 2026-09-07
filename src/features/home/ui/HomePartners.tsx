import {
  STOREFRONT_BRANDS,
  type StorefrontBrand,
} from "@/features/brands/config/brands";

type HomePartnersProps = {
  brands?: readonly StorefrontBrand[];
  title?: string;
};

/**
 * Figma 118:1233 — white partners strip with rounded top over the yellow block.
 * Four bold brand wordmarks centered in a wide row.
 */
export function HomePartners({
  brands = STOREFRONT_BRANDS,
  title,
}: HomePartnersProps) {
  const marks = brands.slice(0, 4);

  return (
    <section
      id="partners"
      className="relative z-10 -mt-12 flex min-h-[200px] flex-col items-center justify-center rounded-t-[40px] bg-white sm:-mt-16 sm:min-h-[280px] lg:min-h-[400px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-center px-6 sm:px-10 lg:px-[138px]">
        {title ? <h2 className="sr-only">{title}</h2> : null}
        <ul className="flex w-full flex-wrap items-center justify-center gap-x-16 gap-y-8 sm:gap-x-24 lg:justify-evenly lg:gap-x-0">
          {marks.map((brand) => (
            <li key={brand.id} className="flex shrink-0 items-center">
              <span className="text-center text-[22px] leading-tight font-bold text-[#111] uppercase sm:text-[32px] lg:text-[44px]">
                {brand.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
