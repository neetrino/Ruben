import { notFound } from "next/navigation";

import { listStorefrontBrands } from "@/features/brands/application/list-storefront-brands";
import { BrandsView } from "@/features/brands/ui/BrandsView";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type BrandsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function BrandsPage({ params }: BrandsPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const [dictionary, brands] = await Promise.all([
    Promise.resolve(getDictionary(rawLocale)),
    listStorefrontBrands(rawLocale),
  ]);

  return (
    <BrandsView locale={rawLocale} dictionary={dictionary} brands={brands} />
  );
}
