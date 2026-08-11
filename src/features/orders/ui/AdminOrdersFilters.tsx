"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import { Card } from "@/components/ui/Card";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import type { OrderStatus } from "@/features/orders/domain/order-status";
import type { PaymentStatus } from "@/features/orders/domain/payment-status";

const FILTER_SEARCH =
  "h-11 min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-300";

type AdminOrdersFiltersProps = {
  locale: string;
  total: number;
  status?: OrderStatus;
  paymentStatus?: string;
  q?: string;
};

export function AdminOrdersFilters({
  locale,
  total,
  status,
  paymentStatus,
  q,
}: AdminOrdersFiltersProps) {
  const t = adminCopy(locale);
  const formRef = useRef<HTMLFormElement>(null);
  const [statusValue, setStatusValue] = useState(status ?? "");
  const [paymentValue, setPaymentValue] = useState(paymentStatus ?? "");

  const orderStatusOptions: ReadonlyArray<{ label: string; value: OrderStatus }> = [
    { label: t.orders.status.pending, value: "PENDING" },
    { label: t.orders.status.processing, value: "PROCESSING" },
    { label: t.orders.status.completed, value: "DELIVERED" },
    { label: t.orders.status.cancelled, value: "CANCELLED" },
  ];

  const paymentStatusOptions: ReadonlyArray<{ label: string; value: PaymentStatus }> = [
    { label: t.orders.payment.paid, value: "CAPTURED" },
    { label: t.orders.payment.pending, value: "PENDING" },
    { label: t.orders.payment.failed, value: "FAILED" },
  ];

  function applyStatus(next: string): void {
    flushSync(() => setStatusValue(next));
    formRef.current?.requestSubmit();
  }

  function applyPayment(next: string): void {
    flushSync(() => setPaymentValue(next));
    formRef.current?.requestSubmit();
  }

  return (
    <Card className="mb-6 overflow-visible">
      <form
        ref={formRef}
        method="get"
        className="flex flex-nowrap items-center gap-3 p-4"
      >
        <SelectDropdown
          name="status"
          ariaLabel={t.orders.filter.orderStatus}
          value={statusValue}
          allLabel={t.orders.filter.allStatuses}
          options={orderStatusOptions}
          className="w-[180px] shrink-0"
          onValueChange={applyStatus}
        />
        <SelectDropdown
          name="paymentStatus"
          ariaLabel={t.orders.filter.paymentStatus}
          value={paymentValue}
          allLabel={t.orders.filter.allPaymentStatuses}
          options={paymentStatusOptions}
          className="w-[200px] shrink-0"
          onValueChange={applyPayment}
        />
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder={t.orders.searchPlaceholder}
          className={FILTER_SEARCH}
          aria-label={t.orders.searchAria}
        />
      </form>
      <div className="border-t border-gray-200 px-4 py-3">
        <p className="text-sm text-gray-600">
          {t.orders.total.replace("{count}", String(total))}
        </p>
      </div>
    </Card>
  );
}
