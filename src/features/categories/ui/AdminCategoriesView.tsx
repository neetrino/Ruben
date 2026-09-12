"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";

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
  deleteCategoryAction,
  reorderCategoriesAction,
} from "@/features/categories/actions";
import type { AdminCategoryListItem } from "@/features/categories/application/list-admin-categories";
import { AddCategoryDrawer } from "@/features/categories/ui/AddCategoryDrawer";

type AdminCategoriesViewProps = {
  locale: string;
  categories: AdminCategoryListItem[];
};

type CategoryTreeNode = {
  category: AdminCategoryListItem;
  children: AdminCategoryListItem[];
};

type FlatRow = {
  category: AdminCategoryListItem;
  depth: 0 | 1;
  childCount: number;
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
  left: AdminCategoryListItem[],
  right: AdminCategoryListItem[],
): boolean {
  if (left.length !== right.length) return false;
  return left.every((item, index) => item.id === right[index]?.id);
}

function sortByOrder(list: AdminCategoryListItem[]): AdminCategoryListItem[] {
  return [...list].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.title.localeCompare(b.title);
  });
}

function buildTree(categories: AdminCategoryListItem[]): CategoryTreeNode[] {
  const roots = sortByOrder(categories.filter((item) => !item.parentId));
  const childrenByParent = new Map<string, AdminCategoryListItem[]>();

  for (const item of categories) {
    if (!item.parentId) continue;
    const bucket = childrenByParent.get(item.parentId) ?? [];
    bucket.push(item);
    childrenByParent.set(item.parentId, bucket);
  }

  return roots.map((root) => ({
    category: root,
    children: sortByOrder(childrenByParent.get(root.id) ?? []),
  }));
}

export function AdminCategoriesView({
  locale,
  categories,
}: AdminCategoriesViewProps) {
  const router = useRouter();
  const t = adminCopy(locale);
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<AdminCategoryListItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [ordered, setOrdered] = useState(categories);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const orderedRef = useRef(ordered);
  const dragOriginRef = useRef<AdminCategoryListItem[] | null>(null);
  const persistedRef = useRef(false);

  useEffect(() => {
    setOrdered(categories);
    orderedRef.current = categories;
  }, [categories]);

  useEffect(() => {
    orderedRef.current = ordered;
  }, [ordered]);

  const needle = query.trim().toLowerCase();
  const isFiltering = needle.length > 0;
  const tree = useMemo(() => buildTree(ordered), [ordered]);

  const visibleRows = useMemo((): FlatRow[] => {
    const rows: FlatRow[] = [];

    for (const node of tree) {
      const rootMatches = node.category.title.toLowerCase().includes(needle);
      const matchingChildren = isFiltering
        ? node.children.filter((child) =>
            child.title.toLowerCase().includes(needle),
          )
        : node.children;

      if (isFiltering && !rootMatches && matchingChildren.length === 0) {
        continue;
      }

      rows.push({
        category: node.category,
        depth: 0,
        childCount: node.children.length,
      });

      const shouldExpand =
        expandedIds.has(node.category.id) ||
        (isFiltering && (rootMatches || matchingChildren.length > 0));

      if (!shouldExpand) continue;

      const childrenToShow = isFiltering
        ? rootMatches
          ? node.children
          : matchingChildren
        : node.children;

      for (const child of childrenToShow) {
        rows.push({
          category: child,
          depth: 1,
          childCount: 0,
        });
      }
    }

    return rows;
  }, [tree, expandedIds, isFiltering, needle]);

  function toggleExpanded(categoryId: string): void {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }

  function requestDelete(categoryId: string, categoryTitle: string): void {
    setPendingDelete({ id: categoryId, title: categoryTitle });
  }

  function confirmDelete(): void {
    if (!pendingDelete) return;
    const categoryId = pendingDelete.id;

    startTransition(async () => {
      setError(null);
      const result = await deleteCategoryAction(locale, categoryId);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setPendingDelete(null);
      router.refresh();
    });
  }

  function siblingIds(parentId: string | null): string[] {
    return orderedRef.current
      .filter((item) => (item.parentId ?? null) === parentId)
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.title.localeCompare(b.title);
      })
      .map((item) => item.id);
  }

  function persistCurrentOrder(parentId: string | null): void {
    if (persistedRef.current) return;
    const next = orderedRef.current;
    const previous = dragOriginRef.current;
    dragOriginRef.current = null;
    if (!previous) return;

    const nextSiblingOrder = next
      .filter((item) => (item.parentId ?? null) === parentId)
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.title.localeCompare(b.title);
      });
    const previousSiblingOrder = previous
      .filter((item) => (item.parentId ?? null) === parentId)
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.title.localeCompare(b.title);
      });

    if (sameOrder(previousSiblingOrder, nextSiblingOrder)) return;

    persistedRef.current = true;
    startTransition(async () => {
      setError(null);
      const result = await reorderCategoriesAction(locale, {
        orderedIds: nextSiblingOrder.map((category) => category.id),
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

  function reorderToward(target: AdminCategoryListItem): void {
    if (!draggingId || isFiltering || draggingId === target.id) return;

    const dragging = orderedRef.current.find((item) => item.id === draggingId);
    if (!dragging) return;
    if ((dragging.parentId ?? null) !== (target.parentId ?? null)) return;

    const parentId = dragging.parentId ?? null;
    const siblingOrder = siblingIds(parentId);
    const fromIndex = siblingOrder.indexOf(draggingId);
    const toIndex = siblingOrder.indexOf(target.id);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

    const nextSiblingOrder = moveItem(siblingOrder, fromIndex, toIndex);
    setOrdered((current) => {
      const next = current.map((item) => {
        if ((item.parentId ?? null) !== parentId) return item;
        const sortOrder = nextSiblingOrder.indexOf(item.id) + 1;
        return sortOrder > 0 ? { ...item, sortOrder } : item;
      });
      orderedRef.current = next;
      return next;
    });
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className={ADMIN_PAGE_TITLE}>{t.categories.title}</h1>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditingCategory(null);
            setDrawerOpen(true);
          }}
          className="inline-flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {t.categories.add}
        </Button>
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t.categories.searchPlaceholder}
        className={`${ADMIN_INPUT} mb-4`}
        aria-label={t.categories.searchAria}
      />

      {isFiltering ? (
        <p className="mb-3 text-xs text-gray-500">
          {t.categories.clearToReorder}
        </p>
      ) : null}

      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}

      <Card className={ADMIN_TABLE_CARD}>
        {visibleRows.length === 0 ? (
          <p className={`${ADMIN_TABLE_STATE_INSET} text-sm text-gray-600`}>
            {categories.length === 0
              ? t.categories.empty
              : t.categories.emptySearch}
          </p>
        ) : (
          <div className={ADMIN_TABLE_OUTER_SCROLL}>
            <table className={ADMIN_TABLE}>
              <thead className={ADMIN_TABLE_THEAD}>
                <tr>
                  <th
                    className={`${ADMIN_TABLE_TH} w-8`}
                    aria-label={t.categories.aria.reorder}
                  />
                  <th className={ADMIN_TABLE_TH}>{t.categories.columns.image}</th>
                  <th className={ADMIN_TABLE_TH}>{t.categories.columns.title}</th>
                  <th className={ADMIN_TABLE_TH}>{t.categories.columns.category}</th>
                  <th className={ADMIN_TABLE_TH_CENTER}>
                    {t.categories.columns.actions}
                  </th>
                </tr>
              </thead>
              <tbody className={ADMIN_TABLE_TBODY}>
                {visibleRows.map(({ category, depth, childCount }) => {
                  const isDragging = draggingId === category.id;
                  const isExpanded = expandedIds.has(category.id);
                  const isRoot = depth === 0;

                  return (
                    <tr
                      key={category.id}
                      className={`${ADMIN_TABLE_ROW} ${
                        isDragging ? "bg-gray-50 opacity-50 shadow-sm" : ""
                      } ${!isRoot ? "bg-gray-50/60" : ""}`}
                      onDragOver={(event) => {
                        if (isFiltering || !draggingId) return;
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                        reorderToward(category);
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        persistCurrentOrder(category.parentId ?? null);
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
                            event.dataTransfer.setData(
                              "text/plain",
                              category.id,
                            );
                            dragOriginRef.current = orderedRef.current;
                            persistedRef.current = false;
                            setDraggingId(category.id);
                          }}
                          onDragEnd={() => {
                            persistCurrentOrder(category.parentId ?? null);
                            setDraggingId(null);
                          }}
                          className="inline-flex cursor-grab touch-none text-gray-400 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={t.categories.aria.reorder}
                        >
                          <GripVertical className="h-4 w-4" />
                        </button>
                      </td>
                      <td className={ADMIN_TABLE_TD}>
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded border border-dashed border-gray-300 bg-gray-50">
                          {category.imageUrl ? (
                            // Category image hosts vary; native img avoids next/image allowlists.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={category.imageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className={ADMIN_TABLE_TD}>
                        <div
                          className={`flex min-w-0 items-center gap-2 ${
                            !isRoot ? "pl-6" : ""
                          }`}
                        >
                          {isRoot && childCount > 0 ? (
                            <button
                              type="button"
                              onClick={() => toggleExpanded(category.id)}
                              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                              aria-expanded={isExpanded || isFiltering}
                              aria-label={t.categories.aria.subcategories.replace(
                                "{count}",
                                String(childCount),
                              )}
                            >
                              {isExpanded || isFiltering ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          ) : (
                            <span className="inline-block w-7 shrink-0" aria-hidden />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900">
                              {category.title}
                            </p>
                            {isRoot && childCount > 0 ? (
                              <p className="text-xs text-gray-500">
                                {t.categories.aria.subcategories.replace(
                                  "{count}",
                                  String(childCount),
                                )}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className={ADMIN_TABLE_TD}>
                        <span className="text-sm text-gray-500">
                          {category.parentTitle ?? t.categories.root}
                        </span>
                      </td>
                      <td className={ADMIN_TABLE_TD_CENTER}>
                        <div className="inline-flex items-center justify-center gap-1">
                          <button
                            type="button"
                            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            aria-label={t.categories.aria.edit}
                            onClick={() => {
                              setEditingCategory(category);
                              setDrawerOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() =>
                              requestDelete(category.id, category.title)
                            }
                            className="rounded p-1.5 text-red-600 hover:bg-red-50"
                            aria-label={t.categories.aria.delete}
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

      <AddCategoryDrawer
        locale={locale}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingCategory(null);
        }}
        categories={categories}
        category={editingCategory}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={t.common.delete}
        description={
          pendingDelete
            ? deleteConfirmDescription(
                t.common.entity.category,
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
        onConfirm={confirmDelete}
      />
    </section>
  );
}
