import { Package, ShoppingBag, Tag, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/Card";
import type {
  AnalyticsTopCategory,
  AnalyticsTopProduct,
} from "@/features/analytics/application/queries";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";

type AnalyticsTopRankingsProps = {
  locale: string;
  products: AnalyticsTopProduct[];
  categories: AnalyticsTopCategory[];
  formatMoney: (amount: number) => string;
};

function RankBadge({
  rank,
  tone,
}: {
  rank: number;
  tone: "amber" | "violet";
}) {
  const classes =
    tone === "amber"
      ? "bg-amber-400 text-white"
      : "bg-violet-500 text-white";

  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${classes}`}
    >
      {rank}
    </div>
  );
}

export function AnalyticsTopRankings({
  locale,
  products,
  categories,
  formatMoney,
}: AnalyticsTopRankingsProps) {
  const t = adminCopy(locale);
  const soldLabel = (count: number): string =>
    t.common.soldCount.replace("{count}", String(count));
  const ordersLabel = (count: number): string =>
    t.common.ordersCount.replace("{count}", String(count));
  const itemsLabel = (count: number): string =>
    t.common.itemsCount.replace("{count}", String(count));

  return (
    <div className="mb-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {t.analytics.products.title}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {`${t.analytics.products.mostSold} · ${t.analytics.products.mostCategories}`}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-gray-900">
              {t.analytics.products.mostSold}
            </h3>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-4 w-4" aria-hidden />
            </div>
          </div>
          <div className="space-y-3">
            {products.map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/40 p-3"
              >
                <RankBadge rank={index + 1} tone="amber" />
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- remote R2 URLs; admin list pattern
                    <img
                      src={product.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-5 w-5 text-gray-400" aria-hidden />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {product.title}
                  </p>
                  <p className="truncate text-xs text-gray-500">{product.sku}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <ShoppingBag className="h-3 w-3" aria-hidden />
                      {soldLabel(product.quantitySold)}
                    </span>
                    <span>|</span>
                    <span>{ordersLabel(product.orderCount)}</span>
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-gray-900">
                  {formatMoney(product.revenueAmount)}
                </p>
              </div>
            ))}
            {products.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                {t.analytics.products.emptyProducts}
              </p>
            ) : null}
          </div>
        </Card>

        <Card className="rounded-2xl p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-gray-900">
              {t.analytics.products.mostCategories}
            </h3>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Tag className="h-4 w-4" aria-hidden />
            </div>
          </div>
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div
                key={category.categoryId}
                className="flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/40 p-3"
              >
                <RankBadge rank={index + 1} tone="violet" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {category.title}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span>{itemsLabel(category.itemCount)}</span>
                    <span>|</span>
                    <span>{ordersLabel(category.orderCount)}</span>
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-gray-900">
                  {formatMoney(category.revenueAmount)}
                </p>
              </div>
            ))}
            {categories.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                {t.analytics.products.emptyCategories}
              </p>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
