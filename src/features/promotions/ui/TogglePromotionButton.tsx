"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import { togglePromotionAction } from "@/features/promotions/application/upsert-promotion";

type TogglePromotionButtonProps = {
  locale: string;
  promotionId: string;
  isActive: boolean;
};

export function TogglePromotionButton({
  locale,
  promotionId,
  isActive,
}: TogglePromotionButtonProps) {
  const router = useRouter();
  const t = adminCopy(locale);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            setError(null);
            const result = await togglePromotionAction(locale, {
              promotionId,
              isActive: !isActive,
            });
            if (!result.ok) {
              setError(result.error.message);
              return;
            }
            router.refresh();
          });
        }}
      >
        {isPending ? t.common.updating : isActive ? t.common.deactivate : t.common.activate}
      </Button>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
