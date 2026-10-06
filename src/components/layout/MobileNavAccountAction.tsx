import { Suspense } from "react";

import { AppLink } from "@/components/ui/AppLink";
import { getCurrentUser } from "@/lib/auth/session";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const ACTION_CLASS =
  "flex w-full items-center justify-center rounded-full bg-[var(--brand)] px-6 py-3.5 text-sm font-semibold text-black transition-colors hover:brightness-95";

type MobileNavAccountLinkProps = {
  locale: Locale;
  dictionary: Dictionary;
  isSignedIn: boolean;
};

/** Burger drawer CTA: login only. Profile lives in the bottom nav when signed in. */
export function MobileNavAccountLink({
  locale,
  dictionary,
  isSignedIn,
}: MobileNavAccountLinkProps) {
  if (isSignedIn) {
    return null;
  }

  return (
    <AppLink
      href={`/${locale}/login`}
      prefetchPolicy="intent"
      className={ACTION_CLASS}
    >
      {dictionary.header.login}
    </AppLink>
  );
}

type MobileNavAccountActionProps = {
  locale: Locale;
  dictionary: Dictionary;
};

async function MobileNavAccountLinkAsync({
  locale,
  dictionary,
}: MobileNavAccountActionProps) {
  const user = await getCurrentUser();

  return (
    <MobileNavAccountLink
      locale={locale}
      dictionary={dictionary}
      isSignedIn={Boolean(user)}
    />
  );
}

/**
 * Session read streams in via Suspense so the sticky mobile chrome around the
 * burger is not blocked on it.
 */
export function MobileNavAccountAction({
  locale,
  dictionary,
}: MobileNavAccountActionProps) {
  return (
    <Suspense
      fallback={
        <div
          className="h-12 w-full animate-pulse rounded-full bg-gray-100"
          aria-hidden
        />
      }
    >
      <MobileNavAccountLinkAsync locale={locale} dictionary={dictionary} />
    </Suspense>
  );
}
