import { HEADER_ASSETS } from "@/components/layout/header-assets";
import { CompareHeaderLink } from "@/features/compare/ui/CompareHeaderLink";
import { getCompareCount } from "@/features/compare/queries";
import type { Locale } from "@/lib/i18n/config";

const MOBILE_COMPARE_BUTTON =
  "relative inline-flex size-12 shrink-0 items-center justify-center overflow-visible rounded-full bg-[var(--brand)]";

const MOBILE_COMPARE_BADGE =
  "absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white";

type MobileCompareSearchLinkProps = {
  locale: Locale;
  label: string;
};

/** Compare shortcut beside the mobile search field. Count loads with the header. */
export async function MobileCompareSearchLink({
  locale,
  label,
}: MobileCompareSearchLinkProps) {
  const count = await getCompareCount();

  return (
    <CompareHeaderLink
      locale={locale}
      label={label}
      count={count}
      className={MOBILE_COMPARE_BUTTON}
      iconSrc={HEADER_ASSETS.compare}
      iconClassName="size-9 brightness-0"
      badgeClassName={MOBILE_COMPARE_BADGE}
    />
  );
}
