import { LegalPolicyPage } from "@/features/legal/ui/LegalPolicyPage";

type RefundPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RefundPage({ params }: RefundPageProps) {
  return <LegalPolicyPage params={params} policyKey="refund" />;
}
