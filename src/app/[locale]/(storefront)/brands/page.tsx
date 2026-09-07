import { notFound } from "next/navigation";

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

  const dictionary = getDictionary(rawLocale);

  return <BrandsView locale={rawLocale} dictionary={dictionary} />;
}
