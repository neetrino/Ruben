import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { AuthFormSkeleton } from "@/components/loading/storefront-skeletons";
import { AuthPageShell } from "@/features/auth/ui/AuthPageShell";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const ForgotPasswordForm = dynamic(
  () =>
    import("@/features/auth/ui/ForgotPasswordForm").then((mod) => ({
      default: mod.ForgotPasswordForm,
    })),
  { loading: () => <AuthFormSkeleton /> },
);

type ForgotPasswordPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ForgotPasswordPage({
  params,
}: ForgotPasswordPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);

  return (
    <AuthPageShell
      brandLabel={dictionary.brand}
      title={dictionary.auth.forgotPasswordTitle}
      subtitle={dictionary.auth.forgotPasswordSubtitle}
    >
      <ForgotPasswordForm locale={rawLocale} dictionary={dictionary.auth} />
    </AuthPageShell>
  );
}
