import {
  ClipboardList,
  DollarSign,
  Users,
  type LucideIcon,
} from "lucide-react";

import {
  ADMIN_CARD_CLASS,
  ADMIN_CARD_HOVER_CLASS,
  ADMIN_CHIP_BRAND,
  ADMIN_CHIP_MINT,
  ADMIN_CHIP_SURFACE,
} from "@/features/admin/ui/admin-ui";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";

type MetricCard = {
  label: string;
  value: string;
  icon: LucideIcon;
  chip: { bg: string; fg: string };
};

type AnalyticsMetricCardsProps = {
  locale: string;
  orderCount: number;
  revenueLabel: string;
  userCount: number;
};

export function AnalyticsMetricCards({
  locale,
  orderCount,
  revenueLabel,
  userCount,
}: AnalyticsMetricCardsProps) {
  const t = adminCopy(locale);
  const metrics: MetricCard[] = [
    {
      label: t.analytics.metrics.orders,
      value: String(orderCount),
      icon: ClipboardList,
      chip: ADMIN_CHIP_BRAND,
    },
    {
      label: t.analytics.metrics.revenue,
      value: revenueLabel,
      icon: DollarSign,
      chip: ADMIN_CHIP_MINT,
    },
    {
      label: t.analytics.metrics.users,
      value: String(userCount),
      icon: Users,
      chip: ADMIN_CHIP_SURFACE,
    },
  ];

  return (
    <div className="mb-3 grid gap-3 sm:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className={`${ADMIN_CARD_CLASS} ${ADMIN_CARD_HOVER_CLASS} p-4`}
          >
            <div
              className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ${metric.chip.bg}`}
            >
              <Icon className={`h-4 w-4 ${metric.chip.fg}`} aria-hidden />
            </div>
            <p className="text-xs font-medium text-gray-500">{metric.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              {metric.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
