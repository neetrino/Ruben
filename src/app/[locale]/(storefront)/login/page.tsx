import { Suspense } from "react";
import { notFound } from "next/navigation";

import { AuthPageShell } from "@/features/auth/ui/AuthPageShell";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

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
      wide
    >
      <Suspense
        fallback={
          <p className="text-center text-sm text-gray-500" aria-hidden="true">
            …
          </p>
        }
      >
        <LoginForm locale={rawLocale} dictionary={dictionary.auth} />
      </Suspense>
    </AuthPageShell>
  );
}
