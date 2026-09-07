import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPoliciesHub } from "@/features/legal/ui/LegalPoliciesHub";
import type { LegalPolicyKey } from "@/features/legal/ui/LegalPolicyPage";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type LegalHubPageProps = {
  params: Promise<{ locale: string }>;
};

/** Order shown in the hub list. */
const POLICY_KEYS: readonly LegalPolicyKey[] = [
  "privacy",
  "terms",
  "delivery",
  "refund",
];

export async function generateMetadata({
  params,
}: LegalHubPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    return {};
  }

  const { legal } = getDictionary(rawLocale);

  return { title: legal.hubTitle, description: legal.hubIntro };
}

export default async function LegalHubPage({ params }: LegalHubPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const { legal } = getDictionary(rawLocale);
  const policies = POLICY_KEYS.map((key) => ({ key, copy: legal[key] }));

  return <LegalPoliciesHub title={legal.hubTitle} policies={policies} />;
}
