"use client";

import { useState, useTransition } from "react";

import type { AdminOrderDetailView } from "@/features/orders/application/order-detail-view";
import { getCustomerOrderDetailAction } from "@/features/orders/application/get-customer-order-detail";
import { CustomerOrdersTable } from "@/features/orders/ui/CustomerOrdersTable";
import { OrderDetailsDrawer } from "@/features/orders/ui/OrderDetailsDrawer";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type CustomerOrdersViewOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  baseCurrency: string;
  placedAt: string | Date;
};

type CustomerOrdersViewProps = {
  locale: string;
  orders: CustomerOrdersViewOrder[];
  emptyLabel: string;
  statusLabels: Dictionary["admin"]["orders"]["status"];
  paymentLabels: Dictionary["admin"]["orders"]["payment"];
};

export function CustomerOrdersView({
  locale,
  orders,
  emptyLabel,
  statusLabels,
  paymentLabels,
}: CustomerOrdersViewProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detail, setDetail] = useState<AdminOrderDetailView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openOrder(orderNumber: string): void {
    setDrawerOpen(true);
    setDetail(null);
    setError(null);

    startTransition(async () => {
      const result = await getCustomerOrderDetailAction(locale, orderNumber);
      if (!result.ok) {
        setError(result.error.message);
        setDetail(null);
        return;
      }
      setDetail(result.value);
    });
  }

  function closeDrawer(): void {
    setDrawerOpen(false);
    setDetail(null);
    setError(null);
  }

  return (
    <>
      <CustomerOrdersTable
        orders={orders}
        emptyLabel={emptyLabel}
        statusLabels={statusLabels}
        paymentLabels={paymentLabels}
        onOpenOrder={openOrder}
      />
      <OrderDetailsDrawer
        locale={locale}
        open={drawerOpen}
        onClose={closeDrawer}
        detail={detail}
        error={error}
        isLoading={isPending}
      />
    </>
  );
}
