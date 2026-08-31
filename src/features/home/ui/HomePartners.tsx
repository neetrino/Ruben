import {
  HOME_PARTNER_BRANDS,
  type HomePartnerBrand,
} from "@/features/home/config/partners";

type HomePartnersProps = {
  brands?: readonly HomePartnerBrand[];
  title?: string;
};

export function HomePartners({
  brands = HOME_PARTNER_BRANDS,
  title,
}: HomePartnersProps) {
  return (
    <section
      id="partners"
      className="scroll-mt-28 rounded-t-[40px] bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-[51px]">
        {title ? <h2 className="sr-only">{title}</h2> : null}
        <ul className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 sm:gap-x-24">
          {brands.slice(0, 4).map((brand) => (
            <li key={brand.id}>
              <span className="text-2xl font-black tracking-[0.12em] text-black uppercase sm:text-3xl">
                {brand.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
