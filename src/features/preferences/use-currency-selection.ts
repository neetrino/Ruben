"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { setCurrencyAction } from "@/features/preferences/set-currency-action";
import type { Currency } from "@/lib/money/currency";

type CurrencySelection = {
  pending: boolean;
  selectCurrency: (next: Currency) => void;
};

/**
 * Persists the display currency and refreshes the current route with it.
 * Price filters are display-currency major units, so they are dropped on switch.
 */
export function useCurrencySelection(): CurrencySelection {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const selectCurrency = useCallback(
    (next: Currency) => {
      startTransition(async () => {
        await setCurrencyAction(next);

        const params = new URLSearchParams(searchParams?.toString() ?? "");
        params.delete("minPrice");
        params.delete("maxPrice");
        const query = params.toString();
        const path = pathname ?? "/";
        router.replace(query ? `${path}?${query}` : path);
        router.refresh();
      });
    },
    [pathname, router, searchParams],
  );

  return { pending, selectCurrency };
}
