"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";

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
import {
  ADMIN_TABLE,
  ADMIN_TABLE_CARD,
  ADMIN_TABLE_OUTER_SCROLL,
  ADMIN_TABLE_ROW,
  ADMIN_TABLE_STATE_INSET,
  ADMIN_TABLE_TBODY,
  ADMIN_TABLE_TD,
  ADMIN_TABLE_TD_CENTER,
  ADMIN_TABLE_TH,
  ADMIN_TABLE_TH_CENTER,
  ADMIN_TABLE_THEAD,
} from "@/features/admin/ui/admin-table-classes";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import {
  deleteBrandAction,
  reorderBrandsAction,
} from "@/features/brands/actions";
import type { AdminBrandListItem } from "@/features/brands/application/list-admin-brands";
import { AddBrandDrawer } from "@/features/brands/ui/AddBrandDrawer";

type AdminBrandsViewProps = {
  locale: string;
  brands: AdminBrandListItem[];
};

function moveItem<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length
  ) {
    return list;
  }
  const next = [...list];
  const [item] = next.splice(fromIndex, 1);
  if (!item) return list;
  next.splice(toIndex, 0, item);
  return next;
}

function sameOrder(
  left: AdminBrandListItem[],
  right: AdminBrandListItem[],
): boolean {
  if (left.length !== right.length) return false;
  return left.every((item, index) => item.id === right[index]?.id);
}

function sortByOrder(list: AdminBrandListItem[]): AdminBrandListItem[] {
  return [...list].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.title.localeCompare(b.title);
  });
}

export function AdminBrandsView({ locale, brands }: AdminBrandsViewProps) {
  const router = useRouter();
  const t = adminCopy(locale);
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<AdminBrandListItem | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [ordered, setOrdered] = useState(() => sortByOrder(brands));
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const orderedRef = useRef(ordered);
  const dragOriginRef = useRef(ordered);
  const persistedRef = useRef(false);

  useEffect(() => {
    const next = sortByOrder(brands);
    setOrdered(next);
    orderedRef.current = next;
  }, [brands]);

  const isFiltering = query.trim().length > 0;

  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = isFiltering ? sortByOrder(brands) : ordered;
    if (!q) return source;
    return source.filter(
      (brand) =>
        brand.title.toLowerCase().includes(q) ||
        brand.slug.toLowerCase().includes(q),
    );
  }, [brands, isFiltering, ordered, query]);

  function persistCurrentOrder(): void {
    if (persistedRef.current || isFiltering) return;
    const next = orderedRef.current;
    const previous = dragOriginRef.current;
    if (sameOrder(previous, next)) return;

    persistedRef.current = true;
    startTransition(async () => {
      setError(null);
      const result = await reorderBrandsAction(locale, {
        orderedIds: next.map((brand) => brand.id),
      });
      if (!result.ok) {
        setOrdered(previous);
        orderedRef.current = previous;
        setError(result.error.message);
        return;
      }
      router.refresh();
    });
  }

  function reorderToward(target: AdminBrandListItem): void {
    if (!draggingId || isFiltering || draggingId === target.id) return;

    const ids = orderedRef.current.map((brand) => brand.id);
    const fromIndex = ids.indexOf(draggingId);
    const toIndex = ids.indexOf(target.id);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

    const nextIds = moveItem(ids, fromIndex, toIndex);
    setOrdered((current) => {
      const next = current.map((item) => {
        const sortOrder = nextIds.indexOf(item.id) + 1;
        return sortOrder > 0 ? { ...item, sortOrder } : item;
      });
      orderedRef.current = sortByOrder(next);
      return orderedRef.current;
    });
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className={ADMIN_PAGE_TITLE}>{t.brands.title}</h1>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditingBrand(null);
            setDrawerOpen(true);
          }}
          className="inline-flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {t.brands.add}
        </Button>
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t.brands.searchPlaceholder}
        className={`${ADMIN_INPUT} mb-4`}
        aria-label={t.brands.searchAria}
      />

      {isFiltering ? (
        <p className="mb-3 text-xs text-gray-500">{t.brands.clearToReorder}</p>
      ) : null}

      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}

      <Card className={ADMIN_TABLE_CARD}>
        {visibleRows.length === 0 ? (
          <p className={`${ADMIN_TABLE_STATE_INSET} text-sm text-gray-600`}>
            {brands.length === 0 ? t.brands.empty : t.brands.emptySearch}
          </p>
        ) : (
          <div className={ADMIN_TABLE_OUTER_SCROLL}>
            <table className={ADMIN_TABLE}>
              <thead className={ADMIN_TABLE_THEAD}>
                <tr>
                  <th
                    className={`${ADMIN_TABLE_TH} w-8`}
                    aria-label={t.brands.aria.reorder}
                  />
                  <th className={ADMIN_TABLE_TH}>{t.brands.columns.image}</th>
                  <th className={ADMIN_TABLE_TH}>{t.brands.columns.title}</th>
                  <th className={ADMIN_TABLE_TH}>{t.brands.columns.slug}</th>
                  <th className={ADMIN_TABLE_TH_CENTER}>
                    {t.brands.columns.actions}
                  </th>
                </tr>
              </thead>
              <tbody className={ADMIN_TABLE_TBODY}>
                {visibleRows.map((brand) => {
                  const isDragging = draggingId === brand.id;

                  return (
                    <tr
                      key={brand.id}
                      className={`${ADMIN_TABLE_ROW} ${
                        isDragging ? "bg-gray-50 opacity-50 shadow-sm" : ""
                      }`}
                      onDragOver={(event) => {
                        if (isFiltering || !draggingId) return;
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                        reorderToward(brand);
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        persistCurrentOrder();
                        setDraggingId(null);
                      }}
                    >
                      <td className={ADMIN_TABLE_TD}>
                        <button
                          type="button"
                          draggable={!isFiltering && !isPending}
                          disabled={isFiltering || isPending}
                          onDragStart={(event) => {
                            if (isFiltering) {
                              event.preventDefault();
                              return;
                            }
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData("text/plain", brand.id);
                            dragOriginRef.current = orderedRef.current;
                            persistedRef.current = false;
                            setDraggingId(brand.id);
                          }}
                          onDragEnd={() => {
                            persistCurrentOrder();
                            setDraggingId(null);
                          }}
                          className="inline-flex cursor-grab touch-none text-gray-400 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={t.brands.aria.reorder}
                        >
                          <GripVertical className="h-4 w-4" />
                        </button>
                      </td>
                      <td className={ADMIN_TABLE_TD}>
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                          {brand.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={brand.imageUrl}
                              alt=""
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <ImageIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden
                            />
                          )}
                        </div>
                      </td>
                      <td className={ADMIN_TABLE_TD}>
                        <span className="font-medium text-gray-900">
                          {brand.title}
                        </span>
                      </td>
                      <td className={ADMIN_TABLE_TD}>
                        <span className="text-sm text-gray-500">
                          {brand.slug || t.common.na}
                        </span>
                      </td>
                      <td className={ADMIN_TABLE_TD_CENTER}>
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBrand(brand);
                              setDrawerOpen(true);
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            aria-label={t.brands.aria.edit}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPendingDelete({
                                id: brand.id,
                                title: brand.title,
                              })
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                            aria-label={t.brands.aria.delete}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AddBrandDrawer
        locale={locale}
        open={drawerOpen}
        brand={editingBrand}
        onClose={() => {
          setDrawerOpen(false);
          setEditingBrand(null);
        }}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={t.common.delete}
        description={
          pendingDelete
            ? deleteConfirmDescription(
                t.common.entity.brand,
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
            const result = await deleteBrandAction(locale, pendingDelete.id);
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
