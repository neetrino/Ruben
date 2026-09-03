"use client";

import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import type { AdminOrderDetailView } from "@/features/orders/application/order-detail-view";
import { getCustomerOrderDetailAction } from "@/features/orders/application/get-customer-order-detail";
import { orderStatusLabel } from "@/features/orders/domain/order-status";
import { OrderDetailsDrawer } from "@/features/orders/ui/OrderDetailsDrawer";
import { ProfileRecentOrderCard } from "@/features/profile/ui/ProfileRecentOrderCard";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { formatMoneyAmount } from "@/lib/money/format";

type RecentOrder = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  itemsCount: number;
  placedAt: string;
};

type ProfileRecentOrdersProps = {
  locale: Locale;
  orders: RecentOrder[];
  dictionary: Dictionary["profile"];
  statusLabels: Dictionary["admin"]["orders"]["status"];
};

function formatItemCount(count: number, one: string, other: string): string {
  const template = count === 1 ? one : other;
  return template.replace("{count}", String(count));
}

function formatPlacedDate(value: string, locale: Locale): string {
  const date = new Date(value);
  const intlLocale =
    locale === "hy" ? "hy-AM" : locale === "ru" ? "ru-RU" : "en-US";
  return new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Yerevan",
  }).format(date);
}

function localizeStatus(
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

function RecentOrdersBody({
  locale,
  orders,
  dictionary,
  statusLabels,
  onOpenOrder,
}: {
  locale: Locale;
  orders: RecentOrder[];
  dictionary: Dictionary["profile"];
  statusLabels: Dictionary["admin"]["orders"]["status"];
  onOpenOrder: (orderNumber: string) => void;
}) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-12">
        <p className="max-w-sm text-center text-sm text-gray-700">
          {dictionary.noOrders}
        </p>
        <AppLink
          href={`/${locale}/products`}
          prefetchPolicy="intent"
          className="inline-flex h-11 w-full max-w-xs items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-bold tracking-wide text-black uppercase transition hover:brightness-95"
        >
          {dictionary.startShopping}
        </AppLink>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 min-[744px]:max-[833px]:grid-cols-2 min-[834px]:grid-cols-3 min-[744px]:gap-[15px]">
      {orders.map((order) => (
        <li key={order.id} className="min-w-0 w-full">
          <ProfileRecentOrderCard
            orderNumber={order.orderNumber}
            status={localizeStatus(order.status, statusLabels)}
            totalLabel={formatMoneyAmount(order.totalAmount, "AMD", locale)}
            metaLine={formatItemCount(
              order.itemsCount,
              dictionary.itemCountOne,
              dictionary.itemCountOther,
            )}
            placedOnLine={`${dictionary.placedOn} ${formatPlacedDate(order.placedAt, locale)}`}
            orderNumberLabel={dictionary.orderNumber}
            viewDetailsLabel={dictionary.viewDetails}
            onViewDetails={() => onOpenOrder(order.orderNumber)}
          />
        </li>
      ))}
    </ul>
  );
}

/** Recent orders section for the profile dashboard (Kamancha card layout). */
export function ProfileRecentOrders({
  locale,
  orders,
  dictionary,
  statusLabels,
}: ProfileRecentOrdersProps) {
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
      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-7">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {dictionary.recentOrders}
          </h2>
          <AppLink
            href={`/${locale}/profile/orders`}
            prefetchPolicy="intent"
            className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700 underline-offset-2 transition hover:underline"
          >
            {dictionary.viewAllOrders}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </AppLink>
        </div>
        <RecentOrdersBody
          locale={locale}
          orders={orders}
          dictionary={dictionary}
          statusLabels={statusLabels}
          onOpenOrder={openOrder}
        />
      </div>
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
