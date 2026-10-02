"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ADMIN_LABEL } from "@/features/admin/ui/admin-form-classes";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import type {
  ProductAttributeOptionGroup,
  ProductAttributeValueOption,
} from "@/features/attributes/application/list-product-attribute-options";
import { useIsClient } from "@/lib/react/use-is-client";

type ProductDrawerAttributesProps = {
  locale: string;
  groups: ProductAttributeOptionGroup[];
  selectedValueIds: string[];
  disabled: boolean;
  onSelectedChange: (ids: string[]) => void;
};

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((entry) => entry !== id) : [...ids, id];
}

function valueById(
  groups: ProductAttributeOptionGroup[],
  valueId: string,
): { group: ProductAttributeOptionGroup; value: ProductAttributeValueOption } | null {
  for (const group of groups) {
    const value = group.values.find((entry) => entry.id === valueId);
    if (value) return { group, value };
  }
  return null;
}

/** Add-attribute button → pick attribute → popup with values (colors/sizes). */
export function ProductDrawerAttributes({
  locale,
  groups,
  selectedValueIds,
  disabled,
  onSelectedChange,
}: ProductDrawerAttributesProps) {
  const t = adminCopy(locale);
  const titleId = useId();
  const isClient = useIsClient();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  const activeGroup =
    groups.find((group) => group.id === activeGroupId) ?? null;

  useEffect(() => {
    if (!pickerOpen) return;
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        if (activeGroupId) setActiveGroupId(null);
        else setPickerOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pickerOpen, activeGroupId]);

  const selectedEntries = selectedValueIds
    .map((id) => valueById(groups, id))
    .filter(
      (
        entry,
      ): entry is {
        group: ProductAttributeOptionGroup;
        value: ProductAttributeValueOption;
      } => entry != null,
    );

  function closePicker(): void {
    setPickerOpen(false);
    setActiveGroupId(null);
  }

  function openPicker(): void {
    setActiveGroupId(null);
    setPickerOpen(true);
  }

  if (groups.length === 0) {
    return (
      <div>
        <span className={ADMIN_LABEL}>{t.products.attributes.title}</span>
        <p className="mt-1 text-sm text-gray-500">{t.products.attributes.empty}</p>
      </div>
    );
  }

  return (
    <div>
      <span className={ADMIN_LABEL}>{t.products.attributes.title}</span>

      {selectedEntries.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {selectedEntries.map(({ group, value }) => (
            <li
              key={value.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-800"
            >
              {value.swatchHex ? (
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-full border border-gray-200"
                  style={{ backgroundColor: value.swatchHex }}
                  aria-hidden
                />
              ) : null}
              <span className="font-medium text-gray-500">{group.title}:</span>
              <span>{value.label}</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  onSelectedChange(toggleId(selectedValueIds, value.id))
                }
                className="rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 disabled:opacity-50"
                aria-label={t.products.attributes.removeValue}
              >
                <X className="h-3 w-3" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        disabled={disabled}
        onClick={openPicker}
        className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50"
      >
        <Plus className="h-4 w-4" aria-hidden />
        {t.products.attributes.add}
      </button>

      {isClient && pickerOpen
        ? createPortal(
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                aria-label={t.common.cancel}
                onClick={closePicker}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-xl"
              >
                <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                  {activeGroup ? (
                    <button
                      type="button"
                      onClick={() => setActiveGroupId(null)}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                      aria-label={t.products.attributes.back}
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden />
                    </button>
                  ) : null}
                  <h3
                    id={titleId}
                    className="min-w-0 flex-1 truncate text-base font-semibold text-gray-900"
                  >
                    {activeGroup
                      ? activeGroup.title
                      : t.products.attributes.pickAttribute}
                  </h3>
                  <button
                    type="button"
                    onClick={closePicker}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                    aria-label={t.common.cancel}
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>

                <div className="max-h-[min(60vh,24rem)] overflow-y-auto px-3 py-3">
                  {!activeGroup ? (
                    <ul className="space-y-1">
                      {groups.map((group) => {
                        const selectedCount = group.values.filter((value) =>
                          selectedValueIds.includes(value.id),
                        ).length;
                        return (
                          <li key={group.id}>
                            <button
                              type="button"
                              onClick={() => setActiveGroupId(group.id)}
                              className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-900 hover:bg-gray-50"
                            >
                              <span className="font-medium">{group.title}</span>
                              <span className="text-xs text-gray-500">
                                {selectedCount > 0
                                  ? t.products.attributes.selectedCount.replace(
                                      "{count}",
                                      String(selectedCount),
                                    )
                                  : t.products.attributes.choose}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : activeGroup.type === "COLOR" ? (
                    <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
                      {activeGroup.values.map((value) => {
                        const checked = selectedValueIds.includes(value.id);
                        return (
                          <button
                            key={value.id}
                            type="button"
                            title={value.label}
                            aria-pressed={checked}
                            onClick={() =>
                              onSelectedChange(
                                toggleId(selectedValueIds, value.id),
                              )
                            }
                            className={`relative flex aspect-square items-center justify-center rounded-xl border-2 transition-colors ${
                              checked
                                ? "border-gray-900"
                                : "border-transparent hover:border-gray-300"
                            }`}
                          >
                            <span
                              className="h-9 w-9 rounded-full border border-black/10 shadow-sm"
                              style={{
                                backgroundColor: value.swatchHex ?? "#ccc",
                              }}
                              aria-hidden
                            />
                            <span className="sr-only">{value.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {activeGroup.values.map((value) => {
                        const checked = selectedValueIds.includes(value.id);
                        return (
                          <li key={value.id}>
                            <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  onSelectedChange(
                                    toggleId(selectedValueIds, value.id),
                                  )
                                }
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <span className="text-sm text-gray-900">
                                {value.label}
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end border-t border-gray-100 px-4 py-3">
                  <Button type="button" size="sm" onClick={closePicker}>
                    {t.products.attributes.done}
                  </Button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
