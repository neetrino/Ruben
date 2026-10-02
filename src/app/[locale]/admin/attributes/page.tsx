import { notFound } from "next/navigation";

import { listAdminAttributes } from "@/features/attributes/application/list-admin-attributes";
import { AdminAttributesView } from "@/features/attributes/ui/AdminAttributesView";
import { isLocale } from "@/lib/i18n/config";

type AdminAttributesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminAttributesPage({
  params,
}: AdminAttributesPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const attributes = await listAdminAttributes(locale);

  return <AdminAttributesView locale={locale} attributes={attributes} />;
}
