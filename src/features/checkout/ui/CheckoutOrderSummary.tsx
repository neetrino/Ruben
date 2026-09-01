"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCheckoutSummaryStickyTop } from "@/features/checkout/ui/use-checkout-summary-sticky-top";

const SUMMARY_ALERT_PILL_CLASS =
  "mb-4 w-full rounded-full bg-red-50 px-4 py-3 text-center text-sm font-medium leading-snug text-red-600";

type CheckoutOrderSummaryProps = {
  title: string;
  couponTitle: string;
  couponPlaceholder: string;
  couponApplyLabel: string;
  couponApplyingLabel: string;
  subtotalLabel: string;
  shippingLabel: string;
  totalLabel: string;
  subtotalFormatted: string;
  shippingFormatted: string;
  totalFormatted: string;
  couponDraft: string;
  onCouponDraftChange: (value: string) => void;
  onApplyCoupon: () => void;
  couponError: string | null;
  isApplyingCoupon: boolean;
  error: string | null;
  isSubmitting: boolean;
  placeOrderLabel: string;
  processingLabel: string;
};

export function CheckoutOrderSummary({
  title,
  couponTitle,
  couponPlaceholder,
  couponApplyLabel,
  couponApplyingLabel,
  subtotalLabel,
  shippingLabel,
  totalLabel,
  subtotalFormatted,
  shippingFormatted,
  totalFormatted,
  couponDraft,
  onCouponDraftChange,
  onApplyCoupon,
  couponError,
  isApplyingCoupon,
  error,
  isSubmitting,
  placeOrderLabel,
  processingLabel,
}: CheckoutOrderSummaryProps) {
  const stickyTop = useCheckoutSummaryStickyTop();

  return (
    <div
      className="lg:sticky xl:self-start"
      style={{
        top: stickyTop,
        maxHeight: `calc(100dvh - ${stickyTop}px - 1rem)`,
      }}
    >
      <Card className="overflow-y-auto overscroll-contain rounded-2xl border border-gray-200/80 p-6 shadow-none">
        <h2 className="mb-6 text-xl font-semibold tracking-wide text-gray-900 uppercase">
          {title}
        </h2>

        <div className="mb-6 rounded-xl border border-gray-200 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm text-gray-700">{couponTitle}</p>
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="h-10 shrink-0 rounded-lg px-4 text-sm"
              disabled={
                isSubmitting || isApplyingCoupon || !couponDraft.trim()
              }
              onClick={onApplyCoupon}
            >
              {isApplyingCoupon ? couponApplyingLabel : couponApplyLabel}
            </Button>
          </div>
          <input
            type="text"
            name="couponCodeDraft"
            value={couponDraft}
            onChange={(event) => onCouponDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onApplyCoupon();
              }
            }}
            placeholder={couponPlaceholder}
            autoComplete="off"
            disabled={isSubmitting || isApplyingCoupon}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-60"
          />
          {couponError ? (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {couponError}
            </p>
          ) : null}
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex justify-between text-gray-600">
            <span>{subtotalLabel}</span>
            <span>{subtotalFormatted}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>{shippingLabel}</span>
            <span className="text-right">{shippingFormatted}</span>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>{totalLabel}</span>
              <span>{totalFormatted}</span>
            </div>
          </div>
        </div>

        {error ? (
          <p className={SUMMARY_ALERT_PILL_CLASS} role="alert">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="h-12 w-full rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? processingLabel : placeOrderLabel}
        </Button>
      </Card>
    </div>
  );
}
