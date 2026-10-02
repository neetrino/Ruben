"use client";

import { useState, useTransition } from "react";
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
  createAttributeFromDrawerAction,
  updateAttributeFromDrawerAction,
} from "@/features/attributes/actions";
import type { AdminAttributeListItem } from "@/features/attributes/application/list-admin-attributes";
import { slugifyAttributeCode } from "@/features/attributes/domain/normalize-attribute";

type AddAttributeDrawerProps = {
  locale: string;
  open: boolean;
  onClose: () => void;
  attribute?: AdminAttributeListItem | null;
};

export function AddAttributeDrawer({
  locale,
  open,
  onClose,
  attribute = null,
}: AddAttributeDrawerProps) {
  const router = useRouter();
  const t = adminCopy(locale);
  const isEdit = attribute != null;
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"TEXT" | "COLOR">("TEXT");
  const [isFilterable, setIsFilterable] = useState(true);
  const [status, setStatus] = useState<"ACTIVE" | "ARCHIVED">("ACTIVE");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const attributeKey = attribute?.id ?? "new";
  const [seed, setSeed] = useState({ open, attributeKey });

  if (seed.open !== open || (open && seed.attributeKey !== attributeKey)) {
    setSeed({ open, attributeKey });
    if (open && attribute) {
      setTitle(attribute.title);
      setType(attribute.type);
      setIsFilterable(attribute.isFilterable);
      setStatus(attribute.status === "ARCHIVED" ? "ARCHIVED" : "ACTIVE");
      setError(null);
    } else if (open) {
      setTitle("");
      setType("TEXT");
      setIsFilterable(true);
      setStatus("ACTIVE");
      setError(null);
    }
  }

  const hasValues = (attribute?.values.length ?? 0) > 0;

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      ariaLabel={
        isEdit ? t.attributes.drawer.editTitle : t.attributes.drawer.createTitle
      }
      panelClassName="w-full max-w-lg"
    >
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEdit ? t.attributes.drawer.editTitle : t.attributes.drawer.createTitle}
        </h2>
      </div>

      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData();
          formData.set("title", title.trim());
          formData.set(
            "code",
            attribute?.code ?? slugifyAttributeCode(title),
          );
          formData.set("type", type);
          formData.set("isFilterable", isFilterable ? "1" : "0");
          formData.set("status", status);

          startTransition(async () => {
            setError(null);
            const result =
              isEdit && attribute
                ? await updateAttributeFromDrawerAction(
                    locale,
                    attribute.id,
                    formData,
                  )
                : await createAttributeFromDrawerAction(locale, formData);

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
              {t.attributes.drawer.titleLabel}{" "}
              <span className="text-red-600">*</span>
            </span>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>

          <div>
            <span className={ADMIN_LABEL}>{t.attributes.drawer.type}</span>
            <SelectDropdown
              ariaLabel={t.attributes.drawer.type}
              value={type}
              options={[
                { label: t.attributes.types.text, value: "TEXT" },
                { label: t.attributes.types.color, value: "COLOR" },
              ]}
              disabled={isPending || hasValues}
              deferChange={false}
              className="mt-1"
              onValueChange={(next) => setType(next as "TEXT" | "COLOR")}
            />
            {hasValues ? (
              <span className="mt-1 block text-xs text-gray-500">
                {t.attributes.drawer.typeLockedHint}
              </span>
            ) : null}
          </div>

          <div>
            <span className={ADMIN_LABEL}>{t.attributes.drawer.status}</span>
            <SelectDropdown
              ariaLabel={t.attributes.drawer.status}
              value={status}
              options={[
                { label: t.attributes.status.published, value: "ACTIVE" },
                { label: t.attributes.status.archived, value: "ARCHIVED" },
              ]}
              disabled={isPending}
              deferChange={false}
              className="mt-1"
              onValueChange={(next) =>
                setStatus(next as "ACTIVE" | "ARCHIVED")
              }
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isFilterable}
              onChange={(event) => setIsFilterable(event.target.checked)}
              disabled={isPending}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-800">
              {t.attributes.drawer.filterable}
            </span>
          </label>

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
                : t.attributes.drawer.create}
          </Button>
        </div>
      </form>
    </SideSheet>
  );
}
