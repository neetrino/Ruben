import { LegalPolicyPage } from "@/features/legal/ui/LegalPolicyPage";

type DeliveryPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DeliveryPage({ params }: DeliveryPageProps) {
  return <LegalPolicyPage params={params} policyKey="delivery" />;
}
