import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { DashboardStatsGrid } from "@/features/admin/ui/DashboardStatsGrid";
import { ADMIN_PAGE_SUBTITLE } from "@/features/admin/ui/admin-form-classes";
import {
  ADMIN_BADGE,
  paymentStatusBadgeClass,
} from "@/features/admin/ui/status-badge";
import {
  defaultAnalyticsDateRange,
  formatPeriodDelta,
} from "@/features/analytics/domain/date-range";
import { getAdminDashboardMetrics } from "@/features/orders/application/queries";
import { isLocale } from "@/lib/i18n/config";
import { getAdminDictionary } from "@/lib/i18n/get-dictionary";

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

function formatMoney(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const QUICK_ACTION_ICONS = [
  {
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    iconPath: "M12 4v16m8-8H4",
  },
  {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    iconPath:
      "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    iconPath:
      "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    iconPath:
      "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  },
] as const;

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const t = getAdminDictionary(locale);
  const metrics = await getAdminDashboardMetrics(defaultAnalyticsDateRange());
  const revenueDelta = t.dashboard.vsPrev.replace(
    "{delta}",
    formatPeriodDelta(metrics.revenueAmount, metrics.previousRevenueAmount),
  );

  const quickActions = [
    {
      href: "products/new",
      title: t.dashboard.quick.addProduct,
      subtitle: t.dashboard.quick.addProductHint,
      ...QUICK_ACTION_ICONS[0],
    },
    {
      href: "orders",
      title: t.dashboard.quick.manageOrders,
      subtitle: t.dashboard.quick.manageOrdersHint,
      ...QUICK_ACTION_ICONS[1],
    },
    {
      href: "users",
      title: t.dashboard.quick.manageUsers,
      subtitle: t.dashboard.quick.manageUsersHint,
      ...QUICK_ACTION_ICONS[2],
    },
    {
      href: "settings",
      title: t.dashboard.quick.settings,
      subtitle: t.dashboard.quick.settingsHint,
      ...QUICK_ACTION_ICONS[3],
    },
  ];

  return (
    <section>
      <div className="mb-8">
        <p className={ADMIN_PAGE_SUBTITLE}>{t.dashboard.welcome}</p>
      </div>

      <DashboardStatsGrid
        locale={locale}
        users={metrics.users}
        products={metrics.products}
        orders={metrics.orders}
        revenueLabel={formatMoney(metrics.revenueAmount)}
        revenueDelta={revenueDelta}
      />

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {t.dashboard.recentOrders}
            </h2>
            <Link
              href={`/${locale}/admin/orders`}
              className="rounded-xl px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              {t.common.viewAll}
            </Link>
          </div>
          <div className="space-y-4">
            {metrics.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/${locale}/admin/orders/${order.orderNumber}`}
                className="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        #{order.orderNumber}
                      </p>
                      <span
                        className={`${ADMIN_BADGE} ${paymentStatusBadgeClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="truncate text-xs text-gray-600">
                      {order.contactEmail}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-gray-900">
                    {formatMoney(order.totalAmount)} {order.baseCurrency}
                  </p>
                </div>
              </Link>
            ))}
            {metrics.recentOrders.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-600">
                {t.dashboard.emptyRecentOrders}
              </p>
            ) : null}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {t.dashboard.topProducts}
            </h2>
            <Link
              href={`/${locale}/admin/products`}
              className="rounded-xl px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              {t.common.viewAll}
            </Link>
          </div>
          <div className="space-y-4">
            {metrics.topProducts.map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center gap-4 rounded-lg border border-gray-200 p-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gray-200 text-xs font-bold text-gray-500">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {product.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.common.soldCount.replace("{count}", String(product.quantity))}
                  </p>
                </div>
              </div>
            ))}
            {metrics.topProducts.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-600">
                {t.dashboard.emptyTopProducts}
              </p>
            ) : null}
          </div>
        </Card>
      </div>

      <Card className="mb-8 p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          {t.dashboard.quickActions}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={`/${locale}/admin/${action.href}`}
              className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-4 transition-colors hover:bg-gray-50"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${action.iconBg}`}
              >
                <svg
                  className={`h-5 w-5 ${action.iconColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={action.iconPath}
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{action.title}</p>
                <p className="text-xs text-gray-500">{action.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </section>
  );
}
