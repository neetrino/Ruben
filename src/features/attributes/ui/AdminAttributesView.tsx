"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ConfirmDialog,
  deleteConfirmDescription,
} from "@/components/ui/ConfirmDialog";
import {
  ADMIN_INPUT,
  ADMIN_PAGE_TITLE,
} from "@/features/admin/ui/admin-form-classes";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import { deleteAttributeAction } from "@/features/attributes/actions";
import type { AdminAttributeListItem } from "@/features/attributes/application/list-admin-attributes";
import { AddAttributeDrawer } from "@/features/attributes/ui/AddAttributeDrawer";
import { AttributeValuesPanel } from "@/features/attributes/ui/AttributeValuesPanel";

type AdminAttributesViewProps = {
  locale: string;
  attributes: AdminAttributeListItem[];
};

export function AdminAttributesView({
  locale,
  attributes,
}: AdminAttributesViewProps) {
  const router = useRouter();
  const t = adminCopy(locale);
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<AdminAttributeListItem | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return attributes;
    return attributes.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q),
    );
  }, [attributes, query]);

  function toggleExpanded(id: string): void {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className={ADMIN_PAGE_TITLE}>{t.attributes.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.attributes.subtitle}</p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditing(null);
            setDrawerOpen(true);
          }}
          className="inline-flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {t.attributes.add}
        </Button>
      </div>

      <div className="mb-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.attributes.searchPlaceholder}
          aria-label={t.attributes.searchAria}
          className={ADMIN_INPUT}
        />
      </div>

      {error ? (
        <p className="mb-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {visible.length === 0 ? (
        <Card className="p-8 text-center text-sm text-gray-500">
          {attributes.length === 0
            ? t.attributes.empty
            : t.attributes.emptySearch}
        </Card>
      ) : (
        <ul className="space-y-3">
          {visible.map((attribute) => {
            const expanded = expandedIds.has(attribute.id);
            return (
              <li key={attribute.id}>
                <Card className="overflow-hidden p-0">
                  <div className="flex items-center gap-2 px-3 py-3 sm:px-4">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(attribute.id)}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                      aria-expanded={expanded}
                      aria-label={t.attributes.aria.toggleValues}
                    >
                      {expanded ? (
                        <ChevronDown className="h-4 w-4" aria-hidden />
                      ) : (
                        <ChevronRight className="h-4 w-4" aria-hidden />
                      )}
                    </button>

                    {attribute.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={attribute.imageUrl}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-lg border border-gray-200 object-contain bg-white"
                      />
                    ) : null}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {attribute.title}
                        </p>
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {attribute.code}
                        </span>
                        <span className="rounded-md bg-sky-50 px-2 py-0.5 text-xs text-sky-700">
                          {attribute.type === "COLOR"
                            ? t.attributes.types.color
                            : t.attributes.types.text}
                        </span>
                        {attribute.isFilterable ? (
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                            {t.attributes.filterableBadge}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {t.attributes.valuesCount.replace(
                          "{count}",
                          String(attribute.values.length),
                        )}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => {
                          setEditing(attribute);
                          setDrawerOpen(true);
                        }}
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                        aria-label={t.attributes.aria.edit}
                      >
                        <Pencil className="h-4 w-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          setPendingDelete({
                            id: attribute.id,
                            title: attribute.title,
                          })
                        }
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        aria-label={t.attributes.aria.delete}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </div>

                  {expanded ? (
                    <AttributeValuesPanel
                      locale={locale}
                      attribute={attribute}
                    />
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <AddAttributeDrawer
        locale={locale}
        open={drawerOpen}
        attribute={editing}
        onClose={() => {
          setDrawerOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={pendingDelete != null}
        title={t.common.delete}
        description={
          pendingDelete
            ? deleteConfirmDescription(
                t.common.entity.attribute,
                pendingDelete.title,
                t.common.confirmDelete,
              )
            : ""
        }
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        isPending={isPending}
        onClose={() => {
          if (!isPending) setPendingDelete(null);
        }}
        onConfirm={() => {
          if (!pendingDelete) return;
          startTransition(async () => {
            setError(null);
            const result = await deleteAttributeAction(
              locale,
              pendingDelete.id,
            );
            setPendingDelete(null);
            if (!result.ok) {
              setError(result.error.message);
              return;
            }
            router.refresh();
          });
        }}
      />
    </section>
  );
}
