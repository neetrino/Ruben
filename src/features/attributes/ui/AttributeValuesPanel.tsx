"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ADMIN_INPUT } from "@/features/admin/ui/admin-form-classes";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import type {
  AdminAttributeListItem,
  AdminAttributeValueItem,
} from "@/features/attributes/application/list-admin-attributes";
import {
  addAttributeValueAction,
  deleteAttributeValueAction,
} from "@/features/attributes/value-actions";

type AttributeValuesPanelProps = {
  locale: string;
  attribute: AdminAttributeListItem;
};

export function AttributeValuesPanel({
  locale,
  attribute,
}: AttributeValuesPanelProps) {
  const router = useRouter();
  const t = adminCopy(locale);
  const [label, setLabel] = useState("");
  const [swatchHex, setSwatchHex] = useState("#000000");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isColor = attribute.type === "COLOR";

  function submitValue(): void {
    const nextLabel = isColor ? label.trim() || swatchHex : label.trim();
    if (!nextLabel) return;

    startTransition(async () => {
      setError(null);
      const result = await addAttributeValueAction(locale, attribute.id, {
        label: nextLabel,
        swatchHex: isColor ? swatchHex : undefined,
      });
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setLabel("");
      router.refresh();
    });
  }

  function removeValue(value: AdminAttributeValueItem): void {
    startTransition(async () => {
      setError(null);
      const result = await deleteAttributeValueAction(locale, value.id);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-3 border-t border-gray-100 bg-gray-50/70 px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        {isColor ? (
          <label className="block shrink-0">
            <span className="mb-1 block text-xs font-medium text-gray-600">
              {t.attributes.values.color}
            </span>
            <input
              type="color"
              value={swatchHex}
              onChange={(event) => setSwatchHex(event.target.value)}
              disabled={isPending}
              className="h-11 w-14 cursor-pointer rounded-xl border border-gray-200 bg-white p-1"
              aria-label={t.attributes.values.color}
            />
          </label>
        ) : null}
        <label className="block min-w-0 flex-1">
          <span className="mb-1 block text-xs font-medium text-gray-600">
            {isColor
              ? t.attributes.values.colorLabel
              : t.attributes.values.addLabel}
          </span>
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submitValue();
              }
            }}
            placeholder={
              isColor
                ? t.attributes.values.colorPlaceholder
                : t.attributes.values.placeholder
            }
            className={ADMIN_INPUT}
            disabled={isPending}
          />
        </label>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={isPending || (!isColor && !label.trim())}
          onClick={submitValue}
          className="inline-flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {t.attributes.values.add}
        </Button>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {attribute.values.length === 0 ? (
        <p className="text-sm text-gray-500">{t.attributes.values.empty}</p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
          {attribute.values.map((value) => (
            <li
              key={value.id}
              className="flex items-center justify-between gap-3 px-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                {value.swatchHex ? (
                  <span
                    className="h-6 w-6 shrink-0 rounded-md border border-gray-200"
                    style={{ backgroundColor: value.swatchHex }}
                    aria-hidden
                  />
                ) : null}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {value.label}
                  </p>
                  <p className="truncate text-xs text-gray-500">{value.code}</p>
                </div>
              </div>
              <button
                type="button"
                disabled={isPending}
                onClick={() => removeValue(value)}
                className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                aria-label={t.attributes.values.deleteAria}
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
