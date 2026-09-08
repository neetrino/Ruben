"use client";

import { usePathname } from "next/navigation";

import { AppLink } from "@/components/ui/AppLink";
import {
  SegmentedField,
  segmentedItemClass,
} from "@/components/ui/SegmentedField";
import type { Locale } from "@/lib/i18n/config";
import {
  localeLabels,
  localeShortLabels,
  locales,
  replaceLocaleInPath,
} from "@/lib/i18n/config";

type MobileLocaleSwitcherProps = {
  locale: Locale;
  label: string;
  onSelect?: () => void;
};

/**
 * Segmented language control for the mobile nav drawer — one tap per locale
 * instead of the nested dropdown used in the desktop header.
 */
export function MobileLocaleSwitcher({
  locale,
  label,
  onSelect,
}: MobileLocaleSwitcherProps) {
  const pathname = usePathname() ?? `/${locale}`;

  return (
    <SegmentedField label={label}>
      {locales.map((item) => {
        const selected = item === locale;

        return (
          <AppLink
            key={item}
            href={replaceLocaleInPath(pathname, item)}
            hrefLang={item}
            prefetchPolicy="intent"
            aria-current={selected ? "true" : undefined}
            aria-label={localeLabels[item]}
            className={segmentedItemClass(selected)}
            onClick={onSelect}
          >
            {localeShortLabels[item]}
          </AppLink>
        );
      })}
    </SegmentedField>
  );
}
