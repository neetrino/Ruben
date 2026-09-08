import dynamic from "next/dynamic";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { AuthFormSkeleton } from "@/components/loading/storefront-skeletons";
import { AuthPageShell } from "@/features/auth/ui/AuthPageShell";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const LoginForm = dynamic(
  () =>
    import("@/features/auth/ui/LoginForm").then((mod) => ({
      default: mod.LoginForm,
    })),
  { loading: () => <AuthFormSkeleton /> },
);

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);

  return (
    <AuthPageShell
      brandLabel={dictionary.brand}
      title={dictionary.auth.loginTitle}
      subtitle={dictionary.auth.loginSubtitle}
    >
      <Suspense fallback={<AuthFormSkeleton />}>
        <LoginForm locale={rawLocale} dictionary={dictionary.auth} />
      </Suspense>
    </AuthPageShell>
  );
}
