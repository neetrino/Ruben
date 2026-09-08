"use client";

import { Copy, Pencil, Star, Trash2 } from "lucide-react";

import {
  ADMIN_TABLE_ROW,
  ADMIN_TABLE_TD,
  ADMIN_TABLE_TD_CHECK,
  ADMIN_TABLE_CHECKBOX,
} from "@/features/admin/ui/admin-table-classes";
import { AdminPlacedStamp } from "@/features/admin/ui/AdminPlacedStamp";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import type { AdminProductListItem } from "@/features/products/application/list-admin-products";
import { formatMoneyAmount } from "@/lib/money/format";

type AdminProductRowProps = {
  locale: string;
  product: AdminProductListItem;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onFeatured: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onVisibility: () => void;
};

export function AdminProductRow({
  locale,
  product,
  selected,
  disabled,
  onToggle,
  onEdit,
  onFeatured,
  onDuplicate,
  onDelete,
  onVisibility,
}: AdminProductRowProps) {
  const t = adminCopy(locale);
  const isActive = product.status === "ACTIVE";

  return (
    <tr
      className={`${ADMIN_TABLE_ROW} cursor-pointer`}
      onClick={onEdit}
    >
      <td
        className={ADMIN_TABLE_TD_CHECK}
        onClick={(event) => event.stopPropagation()}
      >
        <input
          type="checkbox"
          className={ADMIN_TABLE_CHECKBOX}
          checked={selected}
          onChange={onToggle}
          disabled={disabled}
          aria-label={`Select ${product.title}`}
        />
      </td>
      <td className={ADMIN_TABLE_TD}>
        <div className="flex min-w-[200px] items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-gray-100">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[10px] text-gray-400">{t.common.na}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900">{product.title}</p>
            <p className="truncate text-xs text-gray-500">{product.slug}</p>
          </div>
        </div>
      </td>
      <td className={ADMIN_TABLE_TD}>
        <span className="text-gray-900">
          {t.products.pcs.replace("{count}", String(product.stockOnHand))}
        </span>
      </td>
      <td className={ADMIN_TABLE_TD}>
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {formatMoneyAmount(product.priceAmount, "AMD", locale)}
          </span>
          {product.compareAtAmount != null &&
          product.compareAtAmount > product.priceAmount ? (
            <span className="text-xs text-gray-400 line-through">
              {formatMoneyAmount(product.compareAtAmount, "AMD", locale)}
            </span>
          ) : null}
        </div>
      </td>
      <td className={ADMIN_TABLE_TD}>
        <span className="line-clamp-2 max-w-[160px] text-gray-700">
          {product.categoryLabels.length > 0
            ? product.categoryLabels.join(", ")
            : "—"}
        </span>
      </td>
      <td
        className={ADMIN_TABLE_TD}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={onFeatured}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-amber-500"
          aria-label={
            product.isFeatured ? t.products.aria.unfeature : t.products.aria.feature
          }
        >
          <Star
            className={`h-4 w-4 ${product.isFeatured ? "fill-amber-400 text-amber-400" : ""}`}
          />
        </button>
      </td>
      <td
        className={ADMIN_TABLE_TD}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            aria-label={t.products.aria.edit}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={onDuplicate}
            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            aria-label={t.products.aria.duplicate}
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={onDelete}
            className="rounded p-1.5 text-red-600 hover:bg-red-50"
            aria-label={t.products.aria.delete}
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            disabled={disabled}
            onClick={onVisibility}
            className={`relative ml-1 h-5 w-9 rounded-full transition-colors ${
              isActive ? "bg-green-500" : "bg-gray-300"
            }`}
            aria-label={isActive ? t.products.aria.deactivate : t.products.aria.activate}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                isActive ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </td>
      <td className={ADMIN_TABLE_TD}>
        <AdminPlacedStamp value={product.createdAt} />
      </td>
    </tr>
  );
}
