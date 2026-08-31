import {
  HOME_PARTNER_BRANDS,
  type HomePartnerBrand,
} from "@/features/home/config/partners";

type HomePartnersProps = {
  brands?: readonly HomePartnerBrand[];
  title?: string;
};

/**
 * Figma 118:1233 — white partners strip with rounded top over the yellow block.
 * Four bold wordmarks centered in a wide row (LOGO placeholders in the file).
 */
export function HomePartners({
  brands = HOME_PARTNER_BRANDS,
  title,
}: HomePartnersProps) {
  const marks = brands.slice(0, 4);

  return (
    <section
      id="partners"
      className="relative z-10 -mt-12 scroll-mt-28 flex min-h-[280px] items-center rounded-t-[40px] bg-white py-16 sm:-mt-16 sm:min-h-[360px] sm:py-20 lg:min-h-[400px] lg:py-0"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-[138px]">
        {title ? <h2 className="sr-only">{title}</h2> : null}
        <ul className="flex flex-wrap items-center justify-center gap-x-16 gap-y-10 sm:gap-x-24 lg:gap-x-[179px]">
          {marks.map((brand) => (
            <li key={brand.id} className="shrink-0">
              <span className="block text-[28px] leading-7 font-bold text-[#111] uppercase sm:text-[40px] lg:text-[54px] lg:leading-7">
                {brand.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
