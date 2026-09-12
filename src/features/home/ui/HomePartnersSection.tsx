import { listHomePartnerBrands } from "@/features/brands/application/list-storefront-brands";
import { HomePartners } from "@/features/home/ui/HomePartners";
import type { Locale } from "@/lib/i18n/config";

type HomePartnersSectionProps = {
  locale: Locale;
  title: string;
};

/** Streams starred home brands into the partners strip (max 5). */
export async function HomePartnersSection({
  locale,
  title,
}: HomePartnersSectionProps) {
  const brands = await listHomePartnerBrands(locale);
  return <HomePartners brands={brands} title={title} />;
}
