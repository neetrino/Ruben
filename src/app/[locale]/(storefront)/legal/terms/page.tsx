import { LegalPolicyPage } from "@/features/legal/ui/LegalPolicyPage";

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function TermsPage({ params }: TermsPageProps) {
  return <LegalPolicyPage params={params} policyKey="terms" />;
}
