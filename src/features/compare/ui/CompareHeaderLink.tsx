import { GitCompareArrows } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import type { Locale } from "@/lib/i18n/config";

type CompareHeaderLinkProps = {
  locale: Locale;
  label: string;
  count: number;
};

export function CompareHeaderLink({
  locale,
  label,
  count,
}: CompareHeaderLinkProps) {
  return (
    <AppLink
      href={`/${locale}/compare`}
      prefetchPolicy="intent"
      aria-label={label}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-700 transition-colors duration-150 hover:text-gray-900"
    >
      <GitCompareArrows className="h-5 w-5" aria-hidden="true" />
      {count > 0 ? (
        <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </AppLink>
  );
}
