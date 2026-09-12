"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { SideSheet } from "@/components/ui/SideSheet";
import {
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "@/features/admin/ui/admin-form-classes";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import {
  createBrandFromDrawerAction,
  updateBrandFromDrawerAction,
} from "@/features/brands/actions";
import type { AdminBrandListItem } from "@/features/brands/application/list-admin-brands";
import { slugifyCategoryTitle } from "@/features/categories/domain/slugify";

type AddBrandDrawerProps = {
  locale: string;
  open: boolean;
  onClose: () => void;
  brand?: AdminBrandListItem | null;
};

export function AddBrandDrawer({
  locale,
  open,
  onClose,
  brand = null,
}: AddBrandDrawerProps) {
  const router = useRouter();
  const t = adminCopy(locale);
  const isEdit = brand != null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [status, setStatus] = useState<"ACTIVE" | "ARCHIVED">("ACTIVE");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;

    if (brand) {
      setTitle(brand.title);
      setSlug(brand.slug);
      setSlugTouched(true);
      setStatus(brand.status === "ARCHIVED" ? "ARCHIVED" : "ACTIVE");
      setImageFile(null);
      setImagePreview(brand.imageUrl);
      setRemoveExistingImage(false);
      setError(null);
    } else {
      setTitle("");
      setSlug("");
      setSlugTouched(false);
      setStatus("ACTIVE");
      setImageFile(null);
      setImagePreview(null);
      setRemoveExistingImage(false);
      setError(null);
    }
  }, [open, brand]);

  const displaySlug = slugTouched ? slug : slugifyCategoryTitle(title) || "---";

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      ariaLabel={isEdit ? t.brands.drawer.editTitle : t.brands.drawer.createTitle}
      panelClassName="w-full max-w-lg"
    >
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEdit ? t.brands.drawer.editTitle : t.brands.drawer.createTitle}
        </h2>
      </div>

      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          const nextSlug =
            slugTouched && slug.trim()
              ? slug.trim()
              : slugifyCategoryTitle(title);

          const formData = new FormData();
          formData.set("title", title.trim());
          formData.set("slug", nextSlug);
          formData.set("status", status);
          if (imageFile) {
            formData.set("image", imageFile);
          }
          if (removeExistingImage) {
            formData.set("removeImage", "1");
          }

          startTransition(async () => {
            setError(null);
            const result =
              isEdit && brand
                ? await updateBrandFromDrawerAction(locale, brand.id, formData)
                : await createBrandFromDrawerAction(locale, formData);

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
            <span className={ADMIN_LABEL}>
              {t.brands.drawer.titleLabel}{" "}
              <span className="text-red-600">*</span>
            </span>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t.brands.drawer.titlePlaceholder}
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>

          <label className="block">
            <span className={ADMIN_LABEL}>{t.brands.drawer.slug}</span>
            <input
              value={displaySlug === "---" ? "" : displaySlug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              placeholder="---"
              className={ADMIN_INPUT}
              disabled={isPending}
            />
            <span className="mt-1 block text-xs text-gray-500">
              {t.brands.drawer.slugHint}
            </span>
          </label>

          <div>
            <span className={ADMIN_LABEL}>{t.brands.drawer.status}</span>
            <SelectDropdown
              ariaLabel={t.brands.drawer.status}
              value={status}
              options={[
                { label: t.brands.status.published, value: "ACTIVE" },
                { label: t.brands.status.archived, value: "ARCHIVED" },
              ]}
              disabled={isPending}
              deferChange={false}
              className="mt-1"
              onValueChange={(next) =>
                setStatus(next as "ACTIVE" | "ARCHIVED")
              }
            />
          </div>

          <div>
            <span className={ADMIN_LABEL}>{t.brands.drawer.image}</span>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50"
              >
                {imagePreview
                  ? t.brands.drawer.changeImage
                  : `+ ${t.brands.drawer.uploadImage}`}
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
                    if (isEdit && brand?.imageUrl) {
                      setRemoveExistingImage(true);
                    }
                  }}
                  className="text-sm font-medium text-gray-600 hover:text-red-600"
                >
                  {t.brands.drawer.remove}
                </button>
              ) : null}
            </div>
            {imagePreview ? (
              // Brand logos may be local blob or remote CDN URLs.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt=""
                className="mt-3 h-28 w-28 rounded-xl border border-gray-200 object-contain bg-white p-2"
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
                ? t.common.save
                : t.brands.drawer.create}
          </Button>
        </div>
      </form>
    </SideSheet>
  );
}
