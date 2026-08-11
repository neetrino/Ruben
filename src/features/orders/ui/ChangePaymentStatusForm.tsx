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
import { changePaymentStatusAction } from "@/features/orders/application/change-payment-status";
import type { PaymentStatus } from "@/features/orders/domain/payment-status";

type ChangePaymentStatusFormProps = {
  locale: string;
  orderNumber: string;
  currentStatus: PaymentStatus;
  eligibleStatuses: PaymentStatus[];
};

export function ChangePaymentStatusForm({
  locale,
  orderNumber,
  currentStatus,
  eligibleStatuses,
}: ChangePaymentStatusFormProps) {
  const t = adminCopy(locale);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [toStatus, setToStatus] = useState(eligibleStatuses[0] ?? "");
  const [isPending, startTransition] = useTransition();

  const paymentStatusDisplayLabel: Partial<Record<string, string>> = {
    PENDING: t.orders.payment.pending,
    AUTHORIZED: t.orders.payment.pending,
    CAPTURED: t.orders.payment.paid,
    FAILED: t.orders.payment.failed,
    REFUNDED: t.orders.payment.failed,
    CANCELLED: t.orders.payment.failed,
  };

  if (eligibleStatuses.length === 0) {
    return (
      <p className="text-sm text-gray-600">{t.orders.terminalPayment}</p>
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
            const result = await changePaymentStatusAction(locale, {
              orderNumber,
              toStatus: toStatus as PaymentStatus,
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
            {paymentStatusDisplayLabel[currentStatus] ?? currentStatus}
          </strong>
        </p>
        <div>
          <span className={ADMIN_LABEL}>{t.orders.form.newPaymentStatus}</span>
          <SelectDropdown
            name="toStatus"
            ariaLabel={t.orders.form.newPaymentStatus}
            value={toStatus}
            options={eligibleStatuses.map((status) => ({
              label: paymentStatusDisplayLabel[status] ?? status,
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
          {isPending ? t.common.updating : t.orders.updatePayment}
        </Button>
      </form>
    </Card>
  );
}
