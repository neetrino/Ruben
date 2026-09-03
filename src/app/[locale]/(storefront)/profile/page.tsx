import { notFound } from "next/navigation";

import { getProfileDashboard } from "@/features/profile/application/dashboard-queries";
import { ProfileRecentOrders } from "@/features/profile/ui/ProfileRecentOrders";
import { ProfileStatCard } from "@/features/profile/ui/ProfileStatCard";
import { requireUser } from "@/lib/auth/policies";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { formatMoneyAmount } from "@/lib/money/format";

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const user = await requireUser(locale);
  const dictionary = getDictionary(locale);
  const { stats, recentOrders } = await getProfileDashboard(user.id);

  const recentOrdersForClient = recentOrders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    totalAmount: order.totalAmount,
    itemsCount: order.itemsCount,
    placedAt: order.placedAt.toISOString(),
  }));

  return (
    <section className="profile-sheet-keep-frame space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {dictionary.profile.dashboard}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {dictionary.profile.welcome}, {user.firstName}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <ProfileStatCard
          label={dictionary.profile.totalOrders}
          value={String(stats.totalOrders)}
        />
        <ProfileStatCard
          label={dictionary.profile.pendingOrders}
          value={String(stats.pendingOrders)}
        />
        <ProfileStatCard
          label={dictionary.profile.completedOrders}
          value={String(stats.completedOrders)}
        />
        <ProfileStatCard
          label={dictionary.profile.totalSpent}
          value={formatMoneyAmount(stats.totalSpent, "AMD", locale)}
        />
      </div>

      <ProfileRecentOrders
        locale={locale}
        orders={recentOrdersForClient}
        dictionary={dictionary.profile}
        statusLabels={dictionary.admin.orders.status}
      />
    </section>
  );
}
