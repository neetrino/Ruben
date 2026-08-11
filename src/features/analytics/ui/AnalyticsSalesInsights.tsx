import {
  CalendarDays,
  CalendarRange,
  CalendarSearch,
  Crown,
  ShoppingBag,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import type {
  AnalyticsSalesBucket,
  AnalyticsTopCustomer,
} from "@/features/analytics/application/queries";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";

type AnalyticsSalesInsightsProps = {
  locale: string;
  bestDay: AnalyticsSalesBucket | null;
  bestWeek: AnalyticsSalesBucket | null;
  bestMonth: AnalyticsSalesBucket | null;
  bestCustomers: AnalyticsTopCustomer[];
  topBuyers: AnalyticsTopCustomer[];
  formatMoney: (amount: number) => string;
};

function BucketCard({
  title,
  bucket,
  formatMoney,
  icon: Icon,
  tone,
  emptyLabel,
  ordersLabel,
}: {
  title: string;
  bucket: AnalyticsSalesBucket | null;
  formatMoney: (amount: number) => string;
  icon: typeof CalendarDays;
  tone: "blue" | "emerald" | "amber";
  emptyLabel: string;
  ordersLabel: (count: number) => string;
}) {
  const toneClasses = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  }[tone];

  return (
    <Card className="rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneClasses}`}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </div>
      </div>
      {bucket ? (
        <>
          <p className="text-lg font-bold text-gray-900">{bucket.label}</p>
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              {formatMoney(bucket.revenueAmount)}
            </span>{" "}
            · {ordersLabel(bucket.orderCount)}
          </p>
        </>
      ) : (
        <p className="py-4 text-sm text-gray-500">{emptyLabel}</p>
      )}
    </Card>
  );
}

function CustomerList({
  title,
  subtitle,
  customers,
  formatMoney,
  icon: Icon,
  tone,
  metric,
  emptyLabel,
  ordersLabel,
}: {
  title: string;
  subtitle: string;
  customers: AnalyticsTopCustomer[];
  formatMoney: (amount: number) => string;
  icon: typeof Crown;
  tone: "violet" | "sky";
  metric: "revenue" | "orders";
  emptyLabel: string;
  ordersLabel: (count: number) => string;
}) {
  const toneClasses =
    tone === "violet"
      ? {
          icon: "bg-violet-50 text-violet-600",
          row: "border-violet-100 bg-violet-50/40",
        }
      : {
          icon: "bg-sky-50 text-sky-600",
          row: "border-sky-100 bg-sky-50/40",
        };

  return (
    <Card className="rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneClasses.icon}`}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </div>
      </div>
      <div className="space-y-3">
        {customers.map((customer, index) => (
          <div
            key={customer.customerKey}
            className={`flex items-center gap-3 rounded-xl border p-3 ${toneClasses.row}`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-gray-700">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {customer.name}
              </p>
              <p className="truncate text-xs text-gray-500">{customer.email}</p>
            </div>
            <div className="shrink-0 text-right">
              {metric === "revenue" ? (
                <>
                  <p className="text-sm font-bold text-gray-900">
                    {formatMoney(customer.revenueAmount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ordersLabel(customer.orderCount)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-gray-900">
                    {ordersLabel(customer.orderCount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatMoney(customer.revenueAmount)}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
        {customers.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            {emptyLabel}
          </p>
        ) : null}
      </div>
    </Card>
  );
}

export function AnalyticsSalesInsights({
  locale,
  bestDay,
  bestWeek,
  bestMonth,
  bestCustomers,
  topBuyers,
  formatMoney,
}: AnalyticsSalesInsightsProps) {
  const t = adminCopy(locale);
  const ordersLabel = (count: number): string =>
    t.common.ordersCount.replace("{count}", String(count));

  return (
    <div className="mb-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{t.analytics.sales.title}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {t.analytics.sales.subtitle}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <BucketCard
          title={t.analytics.sales.bestDay}
          bucket={bestDay}
          formatMoney={formatMoney}
          icon={CalendarDays}
          tone="blue"
          emptyLabel={t.analytics.sales.empty}
          ordersLabel={ordersLabel}
        />
        <BucketCard
          title={t.analytics.sales.bestWeek}
          bucket={bestWeek}
          formatMoney={formatMoney}
          icon={CalendarRange}
          tone="emerald"
          emptyLabel={t.analytics.sales.empty}
          ordersLabel={ordersLabel}
        />
        <BucketCard
          title={t.analytics.sales.bestMonth}
          bucket={bestMonth}
          formatMoney={formatMoney}
          icon={CalendarSearch}
          tone="amber"
          emptyLabel={t.analytics.sales.empty}
          ordersLabel={ordersLabel}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CustomerList
          title={t.analytics.customers.best}
          subtitle={t.analytics.customers.highestRevenue}
          customers={bestCustomers}
          formatMoney={formatMoney}
          icon={Crown}
          tone="violet"
          metric="revenue"
          emptyLabel={t.analytics.customers.empty}
          ordersLabel={ordersLabel}
        />
        <CustomerList
          title={t.analytics.customers.mostPurchases}
          subtitle={t.analytics.customers.mostOrders}
          customers={topBuyers}
          formatMoney={formatMoney}
          icon={ShoppingBag}
          tone="sky"
          metric="orders"
          emptyLabel={t.analytics.customers.empty}
          ordersLabel={ordersLabel}
        />
      </div>
    </div>
  );
}
