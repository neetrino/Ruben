"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import {
  ADMIN_LABEL,
  ADMIN_SECTION_TITLE,
} from "@/features/admin/ui/admin-form-classes";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import { updateUserStatusAction } from "@/features/users/application/update-user";
import type { UserStatus } from "@/features/users/domain/user-lifecycle";

type UpdateUserStatusFormProps = {
  locale: string;
  userId: string;
  currentStatus: UserStatus;
  eligibleStatuses: UserStatus[];
};

export function UpdateUserStatusForm({
  locale,
  userId,
  currentStatus,
  eligibleStatuses,
}: UpdateUserStatusFormProps) {
  const router = useRouter();
  const t = adminCopy(locale);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(eligibleStatuses[0] ?? "");
  const [isPending, startTransition] = useTransition();

  if (eligibleStatuses.length === 0) {
    return (
      <p className="text-sm text-gray-600">
        {t.users.statusForm.terminal}
      </p>
    );
  }

  return (
    <Card className="p-6">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();

          startTransition(async () => {
            setError(null);
            const result = await updateUserStatusAction(locale, {
              userId,
              status: status as UserStatus,
            });
            if (!result.ok) {
              setError(result.error.message);
              return;
            }
            router.refresh();
          });
        }}
      >
        <h3 className={ADMIN_SECTION_TITLE}>{t.users.statusForm.title}</h3>
        <p className="text-sm text-gray-700">
          {t.common.current} <strong className="text-gray-900">{currentStatus}</strong>
        </p>
        <div>
          <span className={ADMIN_LABEL}>{t.users.statusForm.newStatus}</span>
          <SelectDropdown
            name="status"
            ariaLabel={t.users.statusForm.newStatus}
            value={status}
            options={eligibleStatuses.map((item) => ({
              label: item,
              value: item,
            }))}
            disabled={isPending}
            deferChange={false}
            className="mt-1"
            onValueChange={setStatus}
          />
        </div>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? t.common.updating : t.users.statusForm.update}
        </Button>
      </form>
    </Card>
  );
}
