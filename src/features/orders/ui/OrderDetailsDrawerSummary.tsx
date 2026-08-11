import type { ReactNode } from "react";

import {
  ADMIN_BADGE,
  orderStatusBadgeClass,
  paymentStatusBadgeClass,
} from "@/features/admin/ui/status-badge";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import type { AdminOrderDetailView } from "@/features/orders/application/order-detail-view";
import {
  formatOrderDrawerMoney,
  formatOrderStatusLabel,
} from "@/features/orders/ui/order-drawer-format";

type OrderDetailsDrawerSummaryProps = {
  locale: string;
  detail: AdminOrderDetailView;
};

export function OrderDetailsDrawerSummary({
  locale,
  detail,
}: OrderDetailsDrawerSummaryProps) {
  const t = adminCopy(locale);

  return (
    <div className="rounded-2xl border border-gray-200 px-5 py-4">
      <div className="grid gap-8 md:grid-cols-2">
        <section>
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            {t.orders.drawer.sections.summary}
          </h3>
          <dl className="space-y-3 text-sm">
            <DetailRow
              label={t.orders.drawer.labels.orderNumber}
              value={detail.orderNumber}
            />
            <DetailRow
              label={t.orders.drawer.labels.total}
              value={formatOrderDrawerMoney(
                detail.totalAmount,
                detail.baseCurrency,
              )}
            />
            <DetailRow
              label={t.orders.drawer.labels.status}
              value={
                <span
                  className={`${ADMIN_BADGE} ${orderStatusBadgeClass(detail.status)}`}
                >
                  {formatOrderStatusLabel(detail.status)}
                </span>
              }
            />
            <DetailRow
              label={t.orders.drawer.labels.payment}
              value={
                <span
                  className={`${ADMIN_BADGE} ${paymentStatusBadgeClass(detail.paymentStatus)}`}
                >
                  {formatOrderStatusLabel(detail.paymentStatus)}
                </span>
              }
            />
          </dl>
        </section>

        <section>
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            {t.orders.drawer.sections.customer}
          </h3>
          <dl className="space-y-3 text-sm">
            <DetailRow label={t.orders.drawer.labels.name} value={detail.contactName} />
            <DetailRow label={t.orders.drawer.labels.phone} value={detail.contactPhone} />
            <DetailRow label={t.orders.drawer.labels.email} value={detail.contactEmail} />
          </dl>
        </section>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  );
}
