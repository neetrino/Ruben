"use client";

import {
  SegmentedField,
  segmentedItemClass,
} from "@/components/ui/SegmentedField";
import { useCurrencySelection } from "@/features/preferences/use-currency-selection";
import type { Currency } from "@/lib/money/currency";
import { currencies } from "@/lib/money/currency";

type MobileCurrencySwitcherProps = {
  currency: Currency;
  label: string;
  onSelect?: () => void;
};

/**
 * Segmented display-currency control for the mobile nav drawer, paired with
 * {@link MobileLocaleSwitcher}.
 */
export function MobileCurrencySwitcher({
  currency,
  label,
  onSelect,
}: MobileCurrencySwitcherProps) {
  const { pending, selectCurrency } = useCurrencySelection();

  return (
    <SegmentedField label={label}>
      {currencies.map((item) => {
        const selected = item === currency;

        return (
          <button
            key={item}
            type="button"
            disabled={pending}
            aria-current={selected ? "true" : undefined}
            className={segmentedItemClass(selected)}
            onClick={() => {
              onSelect?.();
              if (selected) return;
              selectCurrency(item);
            }}
          >
            {item}
          </button>
        );
      })}
    </SegmentedField>
  );
}
