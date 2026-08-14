import {
  HOME_PARTNER_BRANDS,
  type HomePartnerBrand,
} from "@/features/home/config/partners";

type HomePartnersProps = {
  title: string;
  subtitle: string;
  brands?: readonly HomePartnerBrand[];
};

export function HomePartners({
  title,
  subtitle,
  brands = HOME_PARTNER_BRANDS,
}: HomePartnersProps) {
  return (
    <section className="border-y border-gray-200 bg-gray-50 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            {title}
          </h2>
          <p className="mt-2 text-base text-gray-600">{subtitle}</p>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <li
              key={brand.id}
              className="flex h-20 items-center justify-center border border-gray-200 bg-white px-4"
            >
              <span className="text-lg font-semibold tracking-wide text-gray-700">
                {brand.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
