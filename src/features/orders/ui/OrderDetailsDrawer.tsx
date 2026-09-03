"use client";

import { MapPin } from "lucide-react";

import { SideSheet } from "@/components/ui/SideSheet";
import {
  orderStatusBadgeClass,
  paymentStatusBadgeClass,
} from "@/features/admin/ui/status-badge";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import type { AdminOrderDetailView } from "@/features/orders/application/order-detail-view";
import { orderStatusLabel } from "@/features/orders/domain/order-status";
import { formatOrderDrawerMoney } from "@/features/orders/ui/order-drawer-format";

type OrderDetailsDrawerProps = {
  locale: string;
  open: boolean;
  onClose: () => void;
  detail: AdminOrderDetailView | null;
  error: string | null;
  isLoading: boolean;
  /** Show customer contact block (admin orders). */
  includeAdminDetails?: boolean;
};

type DrawerCopy = ReturnType<typeof adminCopy>["orders"]["drawer"];
type StatusCopy = ReturnType<typeof adminCopy>["orders"]["status"];
type PaymentCopy = ReturnType<typeof adminCopy>["orders"]["payment"];

function localizeOrderStatus(status: string, labels: StatusCopy): string {
  switch (orderStatusLabel(status)) {
    case "Pending":
      return labels.pending;
    case "Processing":
      return labels.processing;
    case "Completed":
      return labels.completed;
    case "Cancelled":
      return labels.cancelled;
    default:
      return orderStatusLabel(status);
  }
}

function localizePaymentStatus(status: string, labels: PaymentCopy): string {
  const normalized = status.toUpperCase();
  if (normalized === "PAID" || normalized === "CAPTURED") {
    return labels.paid;
  }
  if (normalized === "PENDING" || normalized === "AUTHORIZED") {
    return labels.pending;
  }
  if (
    normalized === "FAILED" ||
    normalized === "CANCELLED" ||
    normalized === "REFUNDED"
  ) {
    return labels.failed;
  }
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

/**
 * Order details sheet — Kamancha layout for profile and admin.
 */
export function OrderDetailsDrawer({
  locale,
  open,
  onClose,
  detail,
  error,
  isLoading,
  includeAdminDetails = false,
}: OrderDetailsDrawerProps) {
  const t = adminCopy(locale);
  const d = t.orders.drawer;

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      ariaLabel={d.title}
      panelClassName="w-[87%] max-w-[420px]"
      backdropBlur
    >
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
          {d.title}
        </h2>
        {detail ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-sm text-gray-500">#{detail.orderNumber}</p>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${orderStatusBadgeClass(detail.status)}`}
            >
              {localizeOrderStatus(detail.status, t.orders.status)}
            </span>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${paymentStatusBadgeClass(detail.paymentStatus)}`}
            >
              {localizePaymentStatus(detail.paymentStatus, t.orders.payment)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-24 animate-pulse rounded-[20px] bg-gray-100" />
            <div className="h-24 animate-pulse rounded-[20px] bg-gray-100" />
            <div className="h-32 animate-pulse rounded-[20px] bg-gray-100" />
          </div>
        ) : null}
        {error ? <p className="py-4 text-sm text-red-700">{error}</p> : null}
        {!isLoading && !error && detail ? (
          <OrderSheetBody
            detail={detail}
            labels={d}
            includeAdminDetails={includeAdminDetails}
          />
        ) : null}
      </div>

      {!isLoading && !error && detail ? (
        <OrderSheetTotals detail={detail} labels={d} />
      ) : null}
    </SideSheet>
  );
}

function OrderSheetBody({
  detail,
  labels,
  includeAdminDetails,
}: {
  detail: AdminOrderDetailView;
  labels: DrawerCopy;
  includeAdminDetails: boolean;
}) {
  const deliveryMeta = detail.isPickup
    ? detail.storeName
      ? `${labels.labels.pickupStore} ${detail.storeName}`
      : detail.shippingMethod
    : detail.deliveryLabel
      ? `${labels.totals.delivery} · ${detail.deliveryLabel}`
      : labels.totals.delivery;

  return (
    <div className="space-y-4">
      {includeAdminDetails ? (
        <section className="space-y-3 rounded-2xl border border-gray-200/80 bg-white p-4">
          <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
            {labels.sections.customer}
          </h3>
          <div className="space-y-2.5 text-sm">
            <DetailRow
              label={labels.labels.name}
              value={detail.contactName}
            />
            <DetailRow
              label={labels.labels.phone}
              value={detail.contactPhone}
            />
            <DetailRow
              label={labels.labels.email}
              value={detail.contactEmail}
            />
            <div className="pt-1.5">
              <DetailRow
                label={labels.labels.method}
                value={detail.paymentMethod}
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-3 rounded-2xl border border-gray-200/80 bg-white p-4">
        <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
          {labels.sections.shipping}
        </h3>
        <div className="flex items-start gap-2 text-sm text-gray-700">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-black">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
          </span>
          <div className="min-w-0 space-y-1">
            <p className="font-medium text-gray-900">{detail.addressLine}</p>
            <p className="text-xs text-gray-500 capitalize">{deliveryMeta}</p>
            {detail.addressHint ? (
              <p className="text-xs text-gray-500">{detail.addressHint}</p>
            ) : null}
          </div>
        </div>
        {!includeAdminDetails ? (
          <div className="space-y-2.5 border-t border-gray-100 pt-3 text-sm">
            <DetailRow
              label={labels.labels.method}
              value={detail.paymentMethod}
            />
          </div>
        ) : null}
      </section>

      <section className="space-y-3">
        <h3 className="px-1 text-sm font-semibold tracking-wide text-gray-900 uppercase">
          {labels.sections.items}
        </h3>
        <ul className="space-y-3">
          {detail.items.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-[20px] border border-gray-200 bg-white p-3"
            >
              <div className="flex items-stretch gap-3">
                <OrderItemThumb title={item.title} imageUrl={item.imageUrl} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="line-clamp-2 text-sm font-medium text-gray-900">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {formatOrderDrawerMoney(
                      item.lineTotalAmount,
                      item.currency,
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {formatOrderDrawerMoney(item.unitPriceAmount, item.currency)}{" "}
                    × {item.quantity}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function OrderSheetTotals({
  detail,
  labels,
}: {
  detail: AdminOrderDetailView;
  labels: DrawerCopy;
}) {
  const shippingLabel = detail.isPickup
    ? labels.freePickup
    : formatOrderDrawerMoney(detail.deliveryAmount, detail.baseCurrency);

  const couponRowLabel = detail.couponCode
    ? `${labels.totals.couponDiscount} (${detail.couponCode})`
    : labels.totals.couponDiscount;

  return (
    <div className="border-t border-gray-200 px-6 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <dl className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-gray-600">
          <dt>{labels.totals.subtotal}</dt>
          <dd className="tabular-nums text-gray-900">
            {formatOrderDrawerMoney(detail.subtotalAmount, detail.baseCurrency)}
          </dd>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <dt>{labels.totals.delivery}</dt>
          <dd className="tabular-nums text-gray-900">{shippingLabel}</dd>
        </div>
        {detail.discountAmount > 0 ? (
          <div className="flex items-center justify-between text-gray-600">
            <dt>{couponRowLabel}</dt>
            <dd className="tabular-nums text-green-700">
              −
              {formatOrderDrawerMoney(
                detail.discountAmount,
                detail.baseCurrency,
              )}
            </dd>
          </div>
        ) : null}
        <div className="flex items-center justify-between pt-1 text-base font-bold text-gray-900">
          <dt>{labels.totals.total}</dt>
          <dd className="tabular-nums">
            {formatOrderDrawerMoney(detail.totalAmount, detail.baseCurrency)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-1.5 text-gray-900">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </p>
  );
}

function OrderItemThumb({
  title,
  imageUrl,
}: {
  title: string;
  imageUrl: string | null;
}) {
  if (!imageUrl) {
    return (
      <span
        className="h-24 w-24 shrink-0 rounded-2xl bg-gray-100"
        aria-hidden
      />
    );
  }

  return (
    // Order/R2 hosts vary — native img avoids brittle next/image allowlists.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={title}
      className="h-24 w-24 shrink-0 rounded-2xl object-cover"
    />
  );
}
