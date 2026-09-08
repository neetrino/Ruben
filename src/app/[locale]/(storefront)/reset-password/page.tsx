import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { AuthFormSkeleton } from "@/components/loading/storefront-skeletons";
import { AuthPageShell } from "@/features/auth/ui/AuthPageShell";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const ResetPasswordForm = dynamic(
  () =>
    import("@/features/auth/ui/ResetPasswordForm").then((mod) => ({
      default: mod.ResetPasswordForm,
    })),
  { loading: () => <AuthFormSkeleton /> },
);

type ResetPasswordPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
};

function resolveToken(raw: string | string[] | undefined): string {
  if (typeof raw === "string") {
    return raw;
  }
  if (Array.isArray(raw) && typeof raw[0] === "string") {
    return raw[0];
  }
  return "";
}

export default async function ResetPasswordPage({
  params,
  searchParams,
}: ResetPasswordPageProps) {
  const { locale: rawLocale } = await params;
  const query = await searchParams;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);
  const token = resolveToken(query.token);

  return (
    <AuthPageShell
      brandLabel={dictionary.brand}
      title={dictionary.auth.resetPasswordTitle}
      subtitle={dictionary.auth.resetPasswordSubtitle}
    >
      <ResetPasswordForm
        locale={rawLocale}
        token={token}
        dictionary={dictionary.auth}
      />
    </AuthPageShell>
  );
}
