import { notFound } from "next/navigation";

import { LegalPolicyDocument } from "@/features/legal/ui/LegalPolicyDocument";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type LegalPolicyKey = "privacy" | "terms" | "refund" | "delivery";

type LegalPolicyPageProps = {
  params: Promise<{ locale: string }>;
  policyKey: LegalPolicyKey;
};

export async function LegalPolicyPage({
  params,
  policyKey,
}: LegalPolicyPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);

  return (
    <div className="-mx-4 -my-10 bg-white px-4 py-12 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <LegalPolicyDocument policy={dictionary.legal[policyKey]} />
    </div>
  );
}
