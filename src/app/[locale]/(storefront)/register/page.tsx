import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { AuthFormSkeleton } from "@/components/loading/storefront-skeletons";
import { AuthPageShell } from "@/features/auth/ui/AuthPageShell";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const RegisterForm = dynamic(
  () =>
    import("@/features/auth/ui/RegisterForm").then((mod) => ({
      default: mod.RegisterForm,
    })),
  { loading: () => <AuthFormSkeleton /> },
);

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);

  return (
    <AuthPageShell
      brandLabel={dictionary.brand}
      title={dictionary.auth.registerTitle}
      subtitle={dictionary.auth.registerSubtitle}
      wide
    >
      <RegisterForm locale={rawLocale} dictionary={dictionary.auth} />
    </AuthPageShell>
  );
}
