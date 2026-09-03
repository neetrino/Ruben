import { Check } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type CheckoutSuccessViewProps = {
  locale: Locale;
  orderNumber: string;
  totalFormatted: string;
  showViewOrders: boolean;
  labels: Dictionary["checkout"]["success"];
};

/**
 * Checkout success — centered celebration panel with brand yellow accent.
 */
export function CheckoutSuccessView({
  locale,
  orderNumber,
  totalFormatted,
  showViewOrders,
  labels,
}: CheckoutSuccessViewProps) {
  return (
    <div className="checkout-success-page relative -mx-4 -my-10 overflow-hidden bg-white sm:-mx-6 lg:-mx-8">
      <div className="relative mx-auto flex min-h-[min(70vh,720px)] max-w-lg flex-col items-center justify-center px-4 py-14 sm:px-6 sm:py-20">
        <div className="checkout-success-panel w-full overflow-hidden rounded-[24px] border border-gray-200/80 bg-white shadow-[0_24px_60px_-32px_rgba(17,24,39,0.35)]">
          <div className="h-1.5 w-full bg-[var(--brand)]" />

          <div className="flex flex-col items-center px-6 py-10 text-center sm:px-10 sm:py-12">
            <div
              className="checkout-success-check mb-6 flex size-20 items-center justify-center rounded-full bg-[var(--brand)] shadow-[0_12px_32px_-12px_rgba(255,202,3,0.9)] sm:mb-8 sm:size-24"
              aria-hidden
            >
              <Check
                className="size-10 text-black sm:size-12"
                strokeWidth={2.75}
              />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {labels.title}
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-600 sm:text-base">
              {labels.body.replace("{orderNumber}", orderNumber)}
            </p>

            <div className="mt-8 w-full rounded-[18px] border border-gray-200 px-5 py-5">
              <p className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
                {labels.total.replace("{amount}", totalFormatted)}
              </p>
            </div>

            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10">
              <AppLink
                href={`/${locale}/products`}
                prefetchPolicy="intent"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-bold tracking-wide text-black uppercase transition hover:brightness-95"
              >
                {labels.continueShopping}
              </AppLink>
              {showViewOrders ? (
                <AppLink
                  href={`/${locale}/profile/orders`}
                  prefetchPolicy="intent"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-900 transition hover:border-gray-300 hover:bg-gray-50"
                >
                  {labels.viewOrders}
                </AppLink>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
