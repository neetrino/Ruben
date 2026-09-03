import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";
import {
  ADMIN_PAGE_SUBTITLE,
  ADMIN_PAGE_TITLE,
} from "@/features/admin/ui/admin-form-classes";
import { ADMIN_BADGE } from "@/features/admin/ui/status-badge";
import { getAdminUserById } from "@/features/users/application/queries";
import {
  getEligibleUserStatuses,
  isUserRole,
  isUserStatus,
} from "@/features/users/domain/user-lifecycle";
import { AdminUserRecentOrders } from "@/features/users/ui/AdminUserRecentOrders";
import { UpdateUserRoleForm } from "@/features/users/ui/UpdateUserRoleForm";
import { UpdateUserStatusForm } from "@/features/users/ui/UpdateUserStatusForm";
import { isLocale } from "@/lib/i18n/config";
import { getAdminDictionary } from "@/lib/i18n/get-dictionary";

type AdminUserDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

function userStatusBadgeClass(status: string): string {
  const normalized = status.toUpperCase();
  if (normalized === "ACTIVE") return "bg-green-100 text-green-800";
  if (normalized === "PENDING" || normalized === "INVITED") {
    return "bg-yellow-100 text-yellow-800";
  }
  if (
    normalized === "SUSPENDED" ||
    normalized === "BANNED" ||
    normalized === "ANONYMIZED"
  ) {
    return "bg-red-100 text-red-800";
  }
  return "bg-gray-100 text-gray-800";
}

function userRoleBadgeClass(role: string): string {
  return role.toUpperCase() === "ADMIN"
    ? "bg-blue-100 text-blue-800"
    : "bg-gray-100 text-gray-800";
}

export default async function AdminUserDetailPage({
  params,
}: AdminUserDetailPageProps) {
  const { locale, id } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const t = getAdminDictionary(locale);
  const detail = await getAdminUserById(id);
  if (!detail) {
    notFound();
  }

  const { user, recentOrders } = detail;
  const role = isUserRole(user.role) ? user.role : null;
  const status = isUserStatus(user.status) ? user.status : null;
  const eligibleStatuses = status ? getEligibleUserStatuses(status) : [];
  const isAnonymized = status === "ANONYMIZED";

  return (
    <section>
      <div className="mb-6">
        <p className={`mb-1 ${ADMIN_PAGE_SUBTITLE}`}>
          <Link
            href={`/${locale}/admin/users`}
            className="font-medium text-gray-700 hover:underline"
          >
            {t.users.breadcrumb}
          </Link>
        </p>
        <h1 className={ADMIN_PAGE_TITLE}>
          {user.firstName} {user.lastName}
        </h1>
        <p className={`mt-1 ${ADMIN_PAGE_SUBTITLE}`}>{user.email}</p>
      </div>

      <Card className="mb-6 p-6">
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <p className="text-gray-700">
            {t.users.detail.role}:{" "}
            <span
              className={`${ADMIN_BADGE} ${userRoleBadgeClass(user.role)}`}
            >
              {user.role}
            </span>
          </p>
          <p className="text-gray-700">
            {t.users.detail.status}:{" "}
            <span
              className={`${ADMIN_BADGE} ${userStatusBadgeClass(user.status)}`}
            >
              {user.status}
            </span>
          </p>
          <p className="text-gray-700">
            {t.users.detail.phone}: {user.phone ?? "—"}
          </p>
          <p className="text-gray-700">
            {t.users.detail.emailVerified}:{" "}
            {user.emailVerifiedAt
              ? user.emailVerifiedAt.toISOString().slice(0, 10)
              : t.users.detail.no}
          </p>
          <p className="text-gray-700">
            {t.users.detail.lastLogin}:{" "}
            {user.lastLoginAt
              ? user.lastLoginAt.toISOString().slice(0, 16).replace("T", " ")
              : t.users.detail.never}{" "}
            {t.common.utc}
          </p>
          <p className="text-gray-700">
            {t.users.detail.created}:{" "}
            {user.createdAt.toISOString().slice(0, 10)}
          </p>
        </div>
      </Card>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        {role ? (
          <UpdateUserRoleForm
            locale={locale}
            userId={user.id}
            currentRole={role}
            disabled={isAnonymized}
          />
        ) : (
          <p className="text-sm text-red-700">{t.users.detail.unknownRole}</p>
        )}
        {status ? (
          <UpdateUserStatusForm
            locale={locale}
            userId={user.id}
            currentStatus={status}
            eligibleStatuses={eligibleStatuses}
          />
        ) : (
          <p className="text-sm text-red-700">{t.users.detail.unknownStatus}</p>
        )}
      </div>

      <AdminUserRecentOrders
        locale={locale}
        copy={t}
        orders={recentOrders.map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          totalAmount: order.totalAmount,
          baseCurrency: order.baseCurrency,
        }))}
      />
    </section>
  );
}
