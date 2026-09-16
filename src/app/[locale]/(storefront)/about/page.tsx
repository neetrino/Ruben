import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutView } from "@/features/about/ui/AboutView";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    return {};
  }

  const { about } = getDictionary(rawLocale);

  return { title: about.title, description: about.seoDescription };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);

  return <AboutView locale={rawLocale} copy={dictionary.about} />;
}
