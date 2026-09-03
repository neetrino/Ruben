import { notFound } from "next/navigation";

import { AdminPageTitle } from "@/features/admin/ui/AdminPageTitle";
import { ADMIN_PAGE_SUBTITLE } from "@/features/admin/ui/admin-form-classes";
import { getAnalyticsSummary } from "@/features/analytics/application/queries";
import {
  buildAnalyticsTrendSeries,
  countAnalyticsRangeDays,
} from "@/features/analytics/domain/dashboard-periods";
import {
  analyticsDateRangeSchema,
  formatPeriodDelta,
  matchAnalyticsPeriodPreset,
  rangeForAnalyticsPeriod,
} from "@/features/analytics/domain/date-range";
import { AnalyticsMetricCards } from "@/features/analytics/ui/AnalyticsMetricCards";
import { AnalyticsOrdersByDay } from "@/features/analytics/ui/AnalyticsOrdersByDay";
import { AnalyticsPeriodCard } from "@/features/analytics/ui/AnalyticsPeriodCard";
import { AnalyticsTopRankings } from "@/features/analytics/ui/AnalyticsTopRankings";
import { isLocale } from "@/lib/i18n/config";
import { getAdminDictionary } from "@/lib/i18n/get-dictionary";
import { formatMoneyAmount } from "@/lib/money/format";

type AdminAnalyticsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default async function AdminAnalyticsPage({
  params,
  searchParams,
}: AdminAnalyticsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const t = getAdminDictionary(locale);
  const raw = await searchParams;
  const defaults = rangeForAnalyticsPeriod("last_7_days");
  const parsed = analyticsDateRangeSchema.safeParse({
    from: firstParam(raw.from) ?? defaults.from,
    to: firstParam(raw.to) ?? defaults.to,
  });

  const range = parsed.success ? parsed.data : defaults;
  const preset = matchAnalyticsPeriodPreset(range);
  const summary = await getAnalyticsSummary({ ...range, locale });
  const exportQuery = new URLSearchParams({
    from: range.from,
    to: range.to,
  }).toString();

  const formatMoney = (amount: number): string =>
    formatMoneyAmount(amount, "AMD", locale);

  const trendPoints = buildAnalyticsTrendSeries(
    summary.dailyRows,
    range,
    locale,
  );
  const aggregatedMonthly = countAnalyticsRangeDays(range) > 45;

  return (
    <section>
      <div className="mb-3">
        <AdminPageTitle>{t.nav.analytics}</AdminPageTitle>
        <p className={`mt-1 ${ADMIN_PAGE_SUBTITLE}`}>{t.analytics.subtitle}</p>
      </div>

      <AnalyticsPeriodCard
        key={`${range.from}:${range.to}`}
        locale={locale}
        from={range.from}
        to={range.to}
        preset={preset}
        exportQuery={exportQuery}
        rangeInvalid={!parsed.success}
      />

      <AnalyticsMetricCards
        locale={locale}
        orderCount={summary.orderCount}
        orderDelta={formatPeriodDelta(
          summary.orderCount,
          summary.previousOrderCount,
        )}
        revenueLabel={formatMoney(summary.revenueAmount)}
        revenueDelta={formatPeriodDelta(
          summary.revenueAmount,
          summary.previousRevenueAmount,
        )}
        averageOrderLabel={formatMoney(summary.averageOrderValue)}
        averageOrderDelta={formatPeriodDelta(
          summary.averageOrderValue,
          summary.previousAverageOrderValue,
        )}
      />

      <AnalyticsOrdersByDay
        locale={locale}
        points={trendPoints}
        aggregatedMonthly={aggregatedMonthly}
      />

      <AnalyticsTopRankings
        locale={locale}
        products={summary.topProducts}
        categories={summary.topCategories}
        formatMoney={formatMoney}
      />
    </section>
  );
}
