"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  ConfirmDialog,
  deleteConfirmDescription,
} from "@/components/ui/ConfirmDialog";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import {
  deleteHeroSlideAction,
  toggleHeroSlideAction,
} from "@/features/hero/application/manage-hero";

type HeroSlideControlsProps = {
  locale: string;
  slideId: string;
  slideTitle: string;
  isActive: boolean;
  onEdit: () => void;
};

export function HeroSlideControls({
  locale,
  slideId,
  slideTitle,
  isActive,
  onEdit,
}: HeroSlideControlsProps) {
  const router = useRouter();
  const t = adminCopy(locale);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function run(
    action: () => Promise<{ ok: boolean; error?: { message: string } }>,
    options?: { closeConfirm?: boolean },
  ): void {
    startTransition(async () => {
      setError(null);
      const result = await action();
      if (!result.ok) {
        setError(result.error?.message ?? t.common.actionFailed);
        return;
      }
      if (options?.closeConfirm) {
        setConfirmOpen(false);
        router.refresh();
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={isPending}
          onClick={onEdit}
          className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
          aria-label={`${t.hero.actions.edit} ${slideTitle}`}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setConfirmOpen(true)}
          className="rounded p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
          aria-label={`${t.common.delete} ${slideTitle}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          disabled={isPending}
          onClick={() =>
            run(() =>
              toggleHeroSlideAction(locale, {
                slideId,
                isActive: !isActive,
              }),
            )
          }
          className={`relative ml-1 h-5 w-9 rounded-full transition-colors disabled:opacity-50 ${
            isActive ? "bg-green-500" : "bg-gray-300"
          }`}
          aria-label={isActive ? t.hero.actions.unpublish : t.hero.actions.publish}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
              isActive ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}

      <ConfirmDialog
        open={confirmOpen}
        title={t.common.delete}
        description={deleteConfirmDescription(t.common.entity.slide, slideTitle, t.common.confirmDelete)}
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        isPending={isPending}
        onClose={() => {
          if (!isPending) setConfirmOpen(false);
        }}
        onConfirm={() =>
          run(() => deleteHeroSlideAction(locale, { slideId }), {
            closeConfirm: true,
          })
        }
      />
    </div>
  );
}
