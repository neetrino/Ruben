"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import {
  ADMIN_LABEL,
  ADMIN_TEXTAREA,
} from "@/features/admin/ui/admin-form-classes";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import { changeOrderStatusAction } from "@/features/orders/application/change-order-status";
import type { OrderStatus } from "@/features/orders/domain/order-status";

type ChangeOrderStatusFormProps = {
  locale: string;
  orderNumber: string;
  currentStatus: OrderStatus;
  eligibleStatuses: OrderStatus[];
};

export function ChangeOrderStatusForm({
  locale,
  orderNumber,
  currentStatus,
  eligibleStatuses,
}: ChangeOrderStatusFormProps) {
  const t = adminCopy(locale);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [toStatus, setToStatus] = useState(eligibleStatuses[0] ?? "");
  const [isPending, startTransition] = useTransition();

  const orderStatusDisplayLabel: Partial<Record<string, string>> = {
    PENDING: t.orders.status.pending,
    CONFIRMED: t.orders.status.pending,
    PROCESSING: t.orders.status.processing,
    SHIPPED: t.orders.status.processing,
    DELIVERED: t.orders.status.completed,
    CANCELLED: t.orders.status.cancelled,
    REFUNDED: t.orders.status.cancelled,
  };

  if (eligibleStatuses.length === 0) {
    return (
      <p className="text-sm text-gray-600">{t.orders.terminalStatus}</p>
    );
  }

  return (
    <Card className="p-6">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const noteRaw = String(formData.get("note") ?? "").trim();

          startTransition(async () => {
            setError(null);
            const result = await changeOrderStatusAction(locale, {
              orderNumber,
              toStatus: toStatus as OrderStatus,
              note: noteRaw.length > 0 ? noteRaw : undefined,
            });

            if (!result.ok) {
              setError(result.error.message);
              return;
            }

            router.refresh();
          });
        }}
      >
        <p className="text-sm text-gray-700">
          {t.common.current}{" "}
          <strong className="text-gray-900">
            {orderStatusDisplayLabel[currentStatus] ?? currentStatus}
          </strong>
        </p>
        <div>
          <span className={ADMIN_LABEL}>{t.orders.form.newStatus}</span>
          <SelectDropdown
            name="toStatus"
            ariaLabel={t.orders.form.newStatus}
            value={toStatus}
            options={eligibleStatuses.map((status) => ({
              label: orderStatusDisplayLabel[status] ?? status,
              value: status,
            }))}
            disabled={isPending}
            deferChange={false}
            className="mt-1"
            onValueChange={setToStatus}
          />
        </div>
        <label>
          <span className={ADMIN_LABEL}>{t.orders.form.noteOptional}</span>
          <textarea
            name="note"
            rows={2}
            maxLength={1000}
            className={ADMIN_TEXTAREA}
            disabled={isPending}
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? t.common.updating : t.orders.updateStatus}
        </Button>
      </form>
    </Card>
  );
}
