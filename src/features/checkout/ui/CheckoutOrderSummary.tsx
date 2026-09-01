"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCheckoutSummaryStickyTop } from "@/features/checkout/ui/use-checkout-summary-sticky-top";

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
      className="lg:sticky lg:self-start"
      style={{
        top: stickyTop,
        maxHeight: `calc(100dvh - ${stickyTop}px - 1rem)`,
      }}
    >
      <Card className="overflow-y-auto overscroll-contain rounded-[15px] border-gray-200 p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">{title}</h2>

        <div className="mb-6 rounded-[15px] border border-gray-200 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm text-gray-700">{couponTitle}</p>
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="h-10 shrink-0 px-4 text-sm"
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
            className="h-11 w-full rounded-[15px] border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50 disabled:opacity-60"
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
          <div className="mb-4 rounded-[15px] border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="h-12 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? processingLabel : placeOrderLabel}
        </Button>
      </Card>
    </div>
  );
}
