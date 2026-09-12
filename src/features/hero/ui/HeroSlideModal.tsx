"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  ConfirmDialog,
  deleteConfirmDescription,
} from "@/components/ui/ConfirmDialog";
import { SideSheet } from "@/components/ui/SideSheet";
import {
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "@/features/admin/ui/admin-form-classes";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import {
  createHeroSlideAction,
  deleteHeroSlideAction,
  toggleHeroSlideAction,
  updateHeroSlideAction,
} from "@/features/hero/application/manage-hero";
import type { AdminHeroSlideListItem } from "@/features/hero/application/queries";

type HeroSlideModalProps = {
  locale: string;
  open: boolean;
  onClose: () => void;
  slide?: AdminHeroSlideListItem | null;
};

export function HeroSlideModal({
  locale,
  open,
  onClose,
  slide = null,
}: HeroSlideModalProps) {
  const isEdit = slide != null;
  const t = adminCopy(locale);

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      ariaLabel={isEdit ? t.hero.drawer.editTitle : t.hero.drawer.createTitle}
      panelClassName="w-full max-w-lg"
    >
      <HeroSlideDrawerForm
        key={slide?.id ?? "create"}
        locale={locale}
        onClose={onClose}
        slide={slide}
      />
    </SideSheet>
  );
}

type HeroSlideDrawerFormProps = {
  locale: string;
  onClose: () => void;
  slide: AdminHeroSlideListItem | null;
};

function HeroSlideDrawerForm({
  locale,
  onClose,
  slide,
}: HeroSlideDrawerFormProps) {
  const router = useRouter();
  const t = adminCopy(locale);
  const isEdit = slide != null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(
    slide && slide.title !== "Untitled" ? slide.title : "",
  );
  const [subtitle, setSubtitle] = useState(slide?.subtitle ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    slide?.imageUrl ?? null,
  );
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isActive, setIsActive] = useState(slide?.isActive ?? false);

  function runSheetAction(
    action: () => Promise<{ ok: boolean; error?: { message: string } }>,
    options?: { closeAfter?: boolean; closeConfirm?: boolean },
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
      }
      if (options?.closeAfter) {
        onClose();
      }
      router.refresh();
    });
  }

  return (
    <>
      <div className="border-b border-gray-200 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? t.hero.drawer.editTitle : t.hero.drawer.createTitle}
          </h2>
          {isEdit && slide ? (
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setConfirmOpen(true)}
                className="rounded p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                aria-label={`${t.common.delete} ${slide.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                disabled={isPending}
                onClick={() => {
                  const next = !isActive;
                  setIsActive(next);
                  runSheetAction(() =>
                    toggleHeroSlideAction(locale, {
                      slideId: slide.id,
                      isActive: next,
                    }),
                  );
                }}
                className={`relative ml-1 h-5 w-9 rounded-full transition-colors disabled:opacity-50 ${
                  isActive ? "bg-green-500" : "bg-gray-300"
                }`}
                aria-label={
                  isActive ? t.hero.actions.unpublish : t.hero.actions.publish
                }
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                    isActive ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData();
          formData.set("title", title.trim());
          formData.set("subtitle", subtitle.trim());
          if (imageFile) {
            formData.set("image", imageFile);
          }
          if (removeExistingImage) {
            formData.set("removeImage", "1");
          }

          startTransition(async () => {
            setError(null);
            const result =
              isEdit && slide
                ? await updateHeroSlideAction(locale, slide.id, formData)
                : await createHeroSlideAction(locale, formData);

            if (!result.ok) {
              setError(result.error.message);
              return;
            }

            onClose();
            router.refresh();
          });
        }}
      >
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <label className="block">
            <span className={ADMIN_LABEL}>{t.hero.form.title}</span>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>

          <label className="block">
            <span className={ADMIN_LABEL}>{t.hero.form.subtitle}</span>
            <input
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>

          <div>
            <span className={ADMIN_LABEL}>{t.hero.form.upload}</span>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50"
              >
                {imagePreview
                  ? t.hero.form.change
                  : `+ ${t.hero.form.uploadPlus}`}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={isPending}
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  event.target.value = "";
                  setImagePreview((current) => {
                    if (current?.startsWith("blob:")) {
                      URL.revokeObjectURL(current);
                    }
                    return file ? URL.createObjectURL(file) : null;
                  });
                  setImageFile(file);
                  setRemoveExistingImage(false);
                }}
              />
              {imagePreview ? (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview((current) => {
                      if (current?.startsWith("blob:")) {
                        URL.revokeObjectURL(current);
                      }
                      return null;
                    });
                    if (isEdit && slide?.imageUrl) {
                      setRemoveExistingImage(true);
                    }
                  }}
                  className="text-sm font-medium text-gray-600 hover:text-red-600"
                >
                  {t.hero.form.remove}
                </button>
              ) : null}
            </div>
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element -- local blob/admin preview
              <img
                src={imagePreview}
                alt=""
                className="mt-3 h-28 w-28 rounded-xl border border-gray-200 object-cover"
              />
            ) : null}
          </div>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="whitespace-nowrap text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {t.common.cancel}
          </button>
          <Button type="submit" disabled={isPending || !title.trim()}>
            {isPending
              ? isEdit
                ? t.common.saving
                : t.common.creating
              : isEdit
                ? t.common.edit
                : t.common.create}
          </Button>
        </div>
      </form>

      {isEdit && slide ? (
        <ConfirmDialog
          open={confirmOpen}
          title={t.common.delete}
          description={deleteConfirmDescription(
            t.common.entity.slide,
            slide.title,
            t.common.confirmDelete,
          )}
          confirmLabel={t.common.delete}
          cancelLabel={t.common.cancel}
          isPending={isPending}
          onClose={() => {
            if (!isPending) setConfirmOpen(false);
          }}
          onConfirm={() =>
            runSheetAction(
              () => deleteHeroSlideAction(locale, { slideId: slide.id }),
              { closeAfter: true, closeConfirm: true },
            )
          }
        />
      ) : null}
    </>
  );
}
