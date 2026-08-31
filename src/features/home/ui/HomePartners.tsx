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
      className="relative z-10 -mt-12 flex min-h-[200px] flex-col items-center justify-center rounded-t-[40px] bg-white sm:-mt-16 sm:min-h-[280px] lg:min-h-[400px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-center px-6 sm:px-10 lg:px-[138px]">
        {title ? <h2 className="sr-only">{title}</h2> : null}
        <ul className="flex w-full flex-wrap items-center justify-center gap-x-16 gap-y-8 sm:gap-x-24 lg:justify-evenly lg:gap-x-0">
          {marks.map((brand) => (
            <li key={brand.id} className="flex h-7 shrink-0 items-center">
              <span className="flex h-7 flex-col justify-center text-center text-[28px] leading-7 font-bold text-[#111] uppercase sm:text-[40px] lg:text-[54px]">
                {brand.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
