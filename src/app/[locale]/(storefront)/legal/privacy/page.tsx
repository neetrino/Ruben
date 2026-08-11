import { LegalPolicyPage } from "@/features/legal/ui/LegalPolicyPage";

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  return <LegalPolicyPage params={params} policyKey="privacy" />;
}
