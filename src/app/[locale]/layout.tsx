import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  createLocaleMetadata,
  resolvePublicAppUrl,
} from "@/lib/seo/site-metadata";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams(): Array<{ locale: Locale }> {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    return {};
  }

  const description = getDictionary(rawLocale).seo.description;

  return createLocaleMetadata(rawLocale, description, resolvePublicAppUrl());
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;

  return (
    <div lang={locale} className="flex min-h-dvh flex-1 flex-col bg-gray-50">
      {children}
    </div>
  );
}
