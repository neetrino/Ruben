"use client";

import { Card } from "@/components/ui/Card";
import { AdminPlacedStamp } from "@/features/admin/ui/AdminPlacedStamp";
import {
  ADMIN_BADGE,
  orderStatusBadgeClass,
  paymentStatusBadgeClass,
} from "@/features/admin/ui/status-badge";
import {
  ADMIN_TABLE,
  ADMIN_TABLE_CARD,
  ADMIN_TABLE_FOOTER_ROUNDED_B,
  ADMIN_TABLE_OUTER_SCROLL,
  ADMIN_TABLE_ROW,
  ADMIN_TABLE_STATE_INSET,
  ADMIN_TABLE_TBODY,
  ADMIN_TABLE_TD,
  ADMIN_TABLE_TD_METRIC,
  ADMIN_TABLE_TH,
  ADMIN_TABLE_TH_METRIC,
  ADMIN_TABLE_THEAD,
} from "@/features/admin/ui/admin-table-classes";
import { orderStatusLabel } from "@/features/orders/domain/order-status";
import { formatOrderDrawerMoney } from "@/features/orders/ui/order-drawer-format";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type CustomerOrderRow = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  baseCurrency: string;
  placedAt: string | Date;
};

type CustomerOrdersTableProps = {
  orders: CustomerOrderRow[];
  emptyLabel: string;
  statusLabels: Dictionary["admin"]["orders"]["status"];
  paymentLabels: Dictionary["admin"]["orders"]["payment"];
  onOpenOrder: (orderNumber: string) => void;
};

function localizeOrderStatus(
  status: string,
  labels: Dictionary["admin"]["orders"]["status"],
): string {
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

function localizePaymentStatus(
  status: string,
  labels: Dictionary["admin"]["orders"]["payment"],
): string {
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

export function CustomerOrdersTable({
  orders,
  emptyLabel,
  statusLabels,
  paymentLabels,
  onOpenOrder,
}: CustomerOrdersTableProps) {
  return (
    <Card className={ADMIN_TABLE_CARD}>
      <div className={ADMIN_TABLE_OUTER_SCROLL}>
        <table className={ADMIN_TABLE}>
          <thead className={ADMIN_TABLE_THEAD}>
            <tr>
              <th className={ADMIN_TABLE_TH}>Order</th>
              <th className={ADMIN_TABLE_TH_METRIC}>Status</th>
              <th className={ADMIN_TABLE_TH_METRIC}>Payment</th>
              <th className={ADMIN_TABLE_TH_METRIC}>Total</th>
              <th className={ADMIN_TABLE_TH_METRIC}>Placed</th>
            </tr>
          </thead>
          <tbody className={ADMIN_TABLE_TBODY}>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={`${ADMIN_TABLE_ROW} cursor-pointer`}
                onClick={() => onOpenOrder(order.orderNumber)}
              >
                <td className={ADMIN_TABLE_TD}>
                  <span className="font-medium text-gray-900">
                    {order.orderNumber}
                  </span>
                </td>
                <td className={ADMIN_TABLE_TD_METRIC}>
                  <span
                    className={`${ADMIN_BADGE} ${orderStatusBadgeClass(order.status)}`}
                  >
                    {localizeOrderStatus(order.status, statusLabels)}
                  </span>
                </td>
                <td className={ADMIN_TABLE_TD_METRIC}>
                  <span
                    className={`${ADMIN_BADGE} ${paymentStatusBadgeClass(order.paymentStatus)}`}
                  >
                    {localizePaymentStatus(order.paymentStatus, paymentLabels)}
                  </span>
                </td>
                <td className={ADMIN_TABLE_TD_METRIC}>
                  <span className="font-semibold text-gray-900">
                    {formatOrderDrawerMoney(
                      order.totalAmount,
                      order.baseCurrency,
                    )}
                  </span>
                </td>
                <td className={ADMIN_TABLE_TD_METRIC}>
                  <AdminPlacedStamp value={order.placedAt} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 ? (
        <p className={`${ADMIN_TABLE_STATE_INSET} text-sm text-gray-600`}>
          {emptyLabel}
        </p>
      ) : (
        <div className={ADMIN_TABLE_FOOTER_ROUNDED_B}>
          <p className="text-sm text-gray-600">
            {orders.length} order{orders.length === 1 ? "" : "s"} on this page
          </p>
        </div>
      )}
    </Card>
  );
}
