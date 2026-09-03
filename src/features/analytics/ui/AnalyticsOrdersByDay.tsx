"use client";

import { TrendingUp } from "lucide-react";

import {
  ADMIN_CARD_CLASS,
  ADMIN_CARD_HOVER_CLASS,
} from "@/features/admin/ui/admin-ui";
import {
  DASHBOARD_ORDERS_COLOR,
  DASHBOARD_REVENUE_COLOR,
  DashboardTrendSvg,
} from "@/features/admin/ui/DashboardTrendSvg";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import type { DashboardTrendPoint } from "@/features/analytics/domain/dashboard-periods";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { formatMoneyAmount } from "@/lib/money/format";

type AnalyticsOrdersByDayProps = {
  locale: string;
  points: DashboardTrendPoint[];
  aggregatedMonthly: boolean;
};

function pickBestPoint(
  points: DashboardTrendPoint[],
): DashboardTrendPoint | null {
  if (points.length === 0) {
    return null;
  }
  return points.reduce((best, point) =>
    point.revenueAmount > best.revenueAmount ? point : best,
  );
}

function StackStat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone: "brand" | "mint" | "ink" | "surface";
}) {
  const toneClass =
    tone === "brand"
      ? "bg-[color-mix(in_srgb,var(--brand)_18%,white)] ring-[color-mix(in_srgb,var(--brand)_28%,white)]"
      : tone === "mint"
        ? "bg-emerald-50 ring-emerald-200/60"
        : tone === "ink"
          ? "bg-gray-900/5 ring-gray-200"
          : "bg-gray-100 ring-gray-100";

  return (
    <div
      className={`rounded-[12px] px-3.5 py-3 ring-1 ${toneClass} ${ADMIN_CARD_HOVER_CLASS}`}
    >
      <p className="text-[11px] font-medium text-gray-500">{label}</p>
      <p className="mt-1 break-words text-base font-bold leading-snug text-gray-900">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 break-words text-[11px] leading-snug text-gray-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function AnalyticsOrdersByDay({
  locale,
  points,
  aggregatedMonthly,
}: AnalyticsOrdersByDayProps) {
  const t = adminCopy(locale);
  const ordersByDay = t.analytics.ordersByDay;
  const dashboard = t.dashboard;
  const resolvedLocale: Locale = isLocale(locale) ? locale : defaultLocale;

  const totalRevenue = points.reduce(
    (sum, point) => sum + point.revenueAmount,
    0,
  );
  const totalOrders = points.reduce((sum, point) => sum + point.orderCount, 0);
  const averageOrderValue =
    totalOrders > 0
      ? Math.round((totalRevenue / totalOrders) * 100) / 100
      : 0;
  const bestPoint = pickBestPoint(points);

  const isEmpty = points.every(
    (point) => point.orderCount === 0 && point.revenueAmount === 0,
  );

  const peakLabel = aggregatedMonthly
    ? dashboard.chartBestMonth
    : ordersByDay.peakDay;

  return (
    <div className={`mb-3 ${ADMIN_CARD_CLASS} p-4`}>
      <div className="mb-3 flex min-w-0 items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--brand)_22%,white)] text-black">
          <TrendingUp className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-gray-900">
            {ordersByDay.title}
          </h2>
          <p className="text-xs text-gray-500">{ordersByDay.subtitle}</p>
        </div>
      </div>

      {isEmpty ? (
        <p className="py-8 text-center text-sm text-gray-500">
          {ordersByDay.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-stretch">
          <div className="order-2 flex min-w-0 flex-col items-center justify-center rounded-[12px] bg-gradient-to-b from-gray-50/70 to-white p-3 ring-1 ring-gray-100/80 lg:order-1">
            <DashboardTrendSvg
              points={points}
              chartAria={ordersByDay.chartAria}
              locale={resolvedLocale}
              tooltip={{
                revenueLabel: dashboard.chartRevenue,
                ordersLabel: dashboard.chartOrders,
                formatRevenue: (amount) =>
                  formatMoneyAmount(amount, "AMD", resolvedLocale),
                formatOrders: (count) => String(count),
              }}
            />
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: DASHBOARD_REVENUE_COLOR }}
                />
                {dashboard.chartRevenue}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: DASHBOARD_ORDERS_COLOR }}
                />
                {dashboard.chartOrders}
              </span>
            </div>
          </div>

          <div className="order-1 flex flex-col gap-2 lg:order-2">
            <StackStat
              label={dashboard.chartRevenue}
              value={formatMoneyAmount(totalRevenue, "AMD", resolvedLocale)}
              tone="brand"
            />
            <StackStat
              label={dashboard.chartOrders}
              value={String(totalOrders)}
              tone="mint"
            />
            <StackStat
              label={dashboard.aov}
              value={formatMoneyAmount(averageOrderValue, "AMD", resolvedLocale)}
              tone="ink"
            />
            <StackStat
              label={peakLabel}
              value={
                bestPoint && bestPoint.revenueAmount > 0
                  ? bestPoint.label
                  : dashboard.chartEmptyShort
              }
              hint={
                bestPoint && bestPoint.revenueAmount > 0
                  ? formatMoneyAmount(
                      bestPoint.revenueAmount,
                      "AMD",
                      resolvedLocale,
                    )
                  : undefined
              }
              tone="surface"
            />
          </div>
        </div>
      )}
    </div>
  );
}
