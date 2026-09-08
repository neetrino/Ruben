"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CheckoutOrderProduct } from "@/features/checkout/ui/checkout-order-product";
import { previewCouponAction } from "@/features/checkout/application/preview-coupon";
import { createOrderAction } from "@/features/checkout/create-order";
import type { CheckoutPaymentMethod } from "@/features/checkout/domain/payment-methods";
import { CHECKOUT_PAYMENT_WALLET_LOGO_SRC } from "@/features/checkout/ui/checkout-payment-ui";
import { CheckoutDetailsSections } from "@/features/checkout/ui/CheckoutDetailsSections";
import { CheckoutOrderSummary } from "@/features/checkout/ui/CheckoutOrderSummary";
import { CheckoutProductsInOrder } from "@/features/checkout/ui/CheckoutProductsInOrder";
import type { CheckoutDeliveryOption } from "@/features/delivery/application/queries";
import type { Locale } from "@/lib/i18n/config";
import { formatMoneyAmount } from "@/lib/money/format";

const CHECKOUT_PAGE_TITLE =
  "flex h-[42px] items-center text-[28px] leading-none font-black tracking-[0.7px] text-black uppercase";

type CheckoutLabels = {
  title: string;
  productsInOrder: string;
  itemsOne: string;
  itemsMany: string;
  removeItem: string;
  contactInformation: string;
  shippingMethod: string;
  shippingAddress: string;
  paymentMethod: string;
  orderSummary: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  deliveryLocation: string;
  selectLocation: string;
  phonePlaceholder: string;
  cityPlaceholder: string;
  addressPlaceholder: string;
  storePickup: string;
  storePickupDescription: string;
  delivery: string;
  deliveryDescription: string;
  deliveryUnavailable: string;
  freePickup: string;
  enterCity: string;
  selectDeliveryLocation: string;
  cashOnDelivery: string;
  cashOnDeliveryDescription: string;
  cashPickup: string;
  card: string;
  cardShort: string;
  cardDescription: string;
  fastshift: string;
  fastshiftDescription: string;
  couponTitle: string;
  couponPlaceholder: string;
  couponApply: string;
  couponApplying: string;
  subtotal: string;
  shipping: string;
  total: string;
  placeOrder: string;
  processing: string;
  continueShopping: string;
  cartEmpty: string;
};

type CheckoutFormProps = {
  locale: Locale;
  labels: CheckoutLabels;
  productsHref: string;
  orderProducts: CheckoutOrderProduct[];
  defaultFirstName: string;
  defaultLastName: string;
  defaultEmail: string;
  defaultPhone: string;
  defaultLine1: string;
  subtotalAmount: number;
  deliveryOptions: CheckoutDeliveryOption[];
  hasItems: boolean;
};

function quoteDeliveryAmount(
  option: CheckoutDeliveryOption | undefined,
  subtotalAmount: number,
): number {
  if (!option) return 0;
  if (
    option.freeThresholdAmount !== null &&
    subtotalAmount >= option.freeThresholdAmount
  ) {
    return 0;
  }
  return option.priceAmount;
}

export function CheckoutForm({
  locale,
  labels,
  productsHref,
  orderProducts,
  defaultFirstName,
  defaultLastName,
  defaultEmail,
  defaultPhone,
  defaultLine1,
  subtotalAmount,
  deliveryOptions,
  hasItems,
}: CheckoutFormProps) {
  const router = useRouter();
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);
  const defaultRuleId = deliveryOptions[0]?.id ?? "";
  const [shippingMethod, setShippingMethod] = useState<"pickup" | "delivery">(
    deliveryOptions.length > 0 ? "delivery" : "pickup",
  );
  const [deliveryRuleId, setDeliveryRuleId] = useState(defaultRuleId);
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>("cash_on_delivery");
  const [error, setError] = useState<string | null>(null);
  const [couponDraft, setCouponDraft] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null,
  );
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [applyingCoupon, startApplyCoupon] = useTransition();

  const selectedDelivery = deliveryOptions.find(
    (option) => option.id === deliveryRuleId,
  );

  const paymentOptions = useMemo(
    () => {
      const isPickup = shippingMethod === "pickup";

      return [
        {
          id: "cash_on_delivery" as const,
          name: isPickup ? labels.cashPickup : labels.cashOnDelivery,
          shortName: isPickup ? labels.cashPickup : labels.cashOnDelivery,
          description: isPickup ? "" : labels.cashOnDeliveryDescription,
          iconKind: "cash" as const,
        },
      {
        id: "fastshift" as const,
        name: labels.fastshift,
        shortName: labels.fastshift,
        description: labels.fastshiftDescription,
        iconKind: "wallet" as const,
        walletLogoSrc: CHECKOUT_PAYMENT_WALLET_LOGO_SRC,
        walletAlt: "FastShift",
      },
      {
        id: "card" as const,
        name: labels.card,
        shortName: labels.cardShort,
        description: labels.cardDescription,
        iconKind: "card-badges" as const,
      },
    ];
    },
    [
      labels.card,
      labels.cardDescription,
      labels.cardShort,
      labels.cashOnDelivery,
      labels.cashOnDeliveryDescription,
      labels.cashPickup,
      labels.fastshift,
      labels.fastshiftDescription,
      shippingMethod,
    ],
  );

  function formatMoney(amount: number): string {
    return formatMoneyAmount(amount, "AMD", locale);
  }

  const quotedDelivery = quoteDeliveryAmount(selectedDelivery, subtotalAmount);
  const shippingAmount = shippingMethod === "pickup" ? 0 : quotedDelivery;
  const totalAmount =
    Math.max(0, subtotalAmount - discountAmount) + shippingAmount;

  const shippingFormatted =
    shippingMethod === "pickup"
      ? labels.freePickup
      : selectedDelivery
        ? `${formatMoney(shippingAmount)} (${selectedDelivery.label})`
        : labels.selectDeliveryLocation;

  function clearAppliedCoupon(): void {
    setAppliedCouponCode(null);
    setDiscountAmount(0);
  }

  function onCouponDraftChange(value: string): void {
    setCouponDraft(value);
    setCouponError(null);
    if (appliedCouponCode) {
      clearAppliedCoupon();
    }
  }

  function onApplyCoupon(): void {
    const code = couponDraft.trim();
    if (!code) {
      return;
    }

    setCouponError(null);
    startApplyCoupon(async () => {
      const result = await previewCouponAction({ couponCode: code });
      if (!result.ok) {
        clearAppliedCoupon();
        setCouponError(result.error);
        return;
      }

      setAppliedCouponCode(result.code);
      setCouponDraft(result.code);
      setDiscountAmount(result.discountAmount);
      setCouponError(null);
    });
  }

  if (!hasItems) {
    return (
      <section className="flex flex-col gap-8 pt-6 sm:pt-8 lg:pt-10">
        <h1 className={CHECKOUT_PAGE_TITLE}>{labels.title}</h1>
        <Card className="rounded-[15px] border-gray-200 p-6 text-center shadow-sm">
          <p className="mb-4 text-[#888]">{labels.cartEmpty}</p>
          <Link href={productsHref}>
            <Button variant="primary" size="md">
              {labels.continueShopping}
            </Button>
          </Link>
        </Card>
      </section>
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await createOrderAction({
        locale,
        idempotencyKey,
        firstName: String(data.get("firstName") ?? ""),
        lastName: String(data.get("lastName") ?? ""),
        contactEmail: String(data.get("contactEmail") ?? ""),
        contactPhone: String(data.get("contactPhone") ?? ""),
        shippingMethod,
        paymentMethod,
        deliveryRuleId:
          shippingMethod === "delivery" ? deliveryRuleId || undefined : undefined,
        city:
          shippingMethod === "delivery"
            ? selectedDelivery?.city
            : undefined,
        line1:
          shippingMethod === "delivery"
            ? String(data.get("line1") ?? "")
            : undefined,
        couponCode: appliedCouponCode ?? undefined,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (result.redirectUrl) {
        window.location.assign(result.redirectUrl);
        return;
      }

      router.push(`/${locale}/checkout/success/${result.orderNumber}`);
      router.refresh();
    });
  }

  return (
    <section className="flex flex-col gap-8 pt-6 sm:pt-8 lg:pt-10">
      <h1 className={CHECKOUT_PAGE_TITLE}>{labels.title}</h1>

      <CheckoutProductsInOrder
        products={orderProducts}
        title={labels.productsInOrder}
        itemsOneLabel={labels.itemsOne}
        itemsManyLabel={labels.itemsMany}
        removeItemLabel={labels.removeItem}
        locale={locale}
        onCartChanged={clearAppliedCoupon}
      />

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <CheckoutDetailsSections
            labels={labels}
            pending={pending}
            shippingMethod={shippingMethod}
            onShippingMethodChange={setShippingMethod}
            deliveryOptions={deliveryOptions}
            deliveryRuleId={deliveryRuleId}
            onDeliveryRuleChange={setDeliveryRuleId}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            paymentOptions={paymentOptions}
            defaultFirstName={defaultFirstName}
            defaultLastName={defaultLastName}
            defaultEmail={defaultEmail}
            defaultPhone={defaultPhone}
            defaultLine1={defaultLine1}
          />

          <CheckoutOrderSummary
            title={labels.orderSummary}
            couponTitle={labels.couponTitle}
            couponPlaceholder={labels.couponPlaceholder}
            couponApplyLabel={labels.couponApply}
            couponApplyingLabel={labels.couponApplying}
            subtotalLabel={labels.subtotal}
            shippingLabel={labels.shipping}
            totalLabel={labels.total}
            subtotalFormatted={formatMoney(subtotalAmount)}
            shippingFormatted={shippingFormatted}
            totalFormatted={formatMoney(totalAmount)}
            couponDraft={couponDraft}
            onCouponDraftChange={onCouponDraftChange}
            onApplyCoupon={onApplyCoupon}
            couponError={couponError}
            isApplyingCoupon={applyingCoupon}
            error={error}
            isSubmitting={pending}
            placeOrderLabel={labels.placeOrder}
            processingLabel={labels.processing}
          />
        </div>
      </form>
    </section>
  );
}
