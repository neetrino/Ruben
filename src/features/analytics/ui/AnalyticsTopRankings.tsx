import { Package, ShoppingBag, Tag } from "lucide-react";

import {
  ADMIN_CARD_CLASS,
  ADMIN_CARD_HOVER_CLASS,
  ADMIN_CHIP_BRAND,
  ADMIN_CHIP_MINT,
} from "@/features/admin/ui/admin-ui";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import type {
  AnalyticsTopCategory,
  AnalyticsTopProduct,
} from "@/features/analytics/application/queries";

type AnalyticsTopRankingsProps = {
  locale: string;
  products: AnalyticsTopProduct[];
  categories: AnalyticsTopCategory[];
  formatMoney: (amount: number) => string;
};

function RankBadge({ rank }: { rank: number }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--brand)_22%,white)] text-[11px] font-bold text-black">
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

  return (
    <div className="mb-3 grid gap-3 lg:grid-cols-2">
      <div className={`${ADMIN_CARD_CLASS} p-4 sm:p-5`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900">
            {t.analytics.topProducts.title}
          </h2>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${ADMIN_CHIP_BRAND.bg} ${ADMIN_CHIP_BRAND.fg}`}
          >
            <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
          </div>
        </div>
        <div className="space-y-2">
          {products.map((product, index) => (
            <div
              key={product.productId}
              className={`flex items-center gap-3 rounded-[12px] px-2.5 py-2 ring-1 ring-gray-100/80 ${ADMIN_CARD_HOVER_CLASS}`}
            >
              <RankBadge rank={index + 1} />
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-gray-50">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- remote R2 URLs; admin list pattern
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-4 w-4 text-gray-400" aria-hidden />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {product.title}
                </p>
                <p className="truncate text-[11px] text-gray-500">
                  {product.sku}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                  <span>
                    {t.analytics.topProducts.sold.replace(
                      "{quantity}",
                      String(product.quantitySold),
                    )}
                  </span>
                  <span aria-hidden>|</span>
                  <span>
                    {t.analytics.topProducts.orders.replace(
                      "{count}",
                      String(product.orderCount),
                    )}
                  </span>
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-gray-900">
                {formatMoney(product.revenueAmount)}
              </p>
            </div>
          ))}
          {products.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              {t.analytics.topProducts.empty}
            </p>
          ) : null}
        </div>
      </div>

      <div className={`${ADMIN_CARD_CLASS} p-4 sm:p-5`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900">
            {t.analytics.topCategories.title}
          </h2>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${ADMIN_CHIP_MINT.bg} ${ADMIN_CHIP_MINT.fg}`}
          >
            <Tag className="h-3.5 w-3.5" aria-hidden />
          </div>
        </div>
        <div className="space-y-2">
          {categories.map((category, index) => (
            <div
              key={category.categoryId}
              className={`flex items-center gap-3 rounded-[12px] px-2.5 py-2 ring-1 ring-gray-100/80 ${ADMIN_CARD_HOVER_CLASS}`}
            >
              <RankBadge rank={index + 1} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {category.title}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                  <span>
                    {t.analytics.topCategories.items.replace(
                      "{count}",
                      String(category.itemCount),
                    )}
                  </span>
                  <span aria-hidden>|</span>
                  <span>
                    {t.analytics.topCategories.orders.replace(
                      "{count}",
                      String(category.orderCount),
                    )}
                  </span>
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-gray-900">
                {formatMoney(category.revenueAmount)}
              </p>
            </div>
          ))}
          {categories.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              {t.analytics.topCategories.empty}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
