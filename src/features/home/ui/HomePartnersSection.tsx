import { listStorefrontBrands } from "@/features/brands/application/list-storefront-brands";
import { HomePartners } from "@/features/home/ui/HomePartners";
import type { Locale } from "@/lib/i18n/config";

type HomePartnersSectionProps = {
  locale: Locale;
  title: string;
};

/** Streams admin-managed brands into the home partners strip. */
export async function HomePartnersSection({
  locale,
  title,
}: HomePartnersSectionProps) {
  const brands = await listStorefrontBrands(locale);
  return <HomePartners brands={brands} title={title} />;
}
