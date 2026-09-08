"use client";

import { SquarePen, Trash2 } from "lucide-react";

import type { CustomerAddressListItem } from "@/features/profile/application/address-queries";

type ProfileAddressCardProps = {
  address: CustomerAddressListItem;
  disabled: boolean;
  labels: {
    defaultBadge: string;
    setDefault: string;
    edit: string;
    delete: string;
  };
  onSetDefault: (addressId: string) => void;
  onEdit: (address: CustomerAddressListItem) => void;
  onDelete: (addressId: string) => void;
};

const ICON_BUTTON =
  "flex size-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Address card — Kamancha layout: badge + title, icon edit/delete, set-default CTA.
 */
export function ProfileAddressCard({
  address,
  disabled,
  labels,
  onSetDefault,
  onEdit,
  onDelete,
}: ProfileAddressCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {address.isDefaultShipping ? (
            <div className="mb-3">
              <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                {labels.defaultBadge}
              </span>
            </div>
          ) : null}
          <h2 className="truncate text-base font-semibold text-gray-900">
            {address.line1}
          </h2>
          <p className="mt-1 truncate text-sm text-gray-600">{address.city}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            className={ICON_BUTTON}
            aria-label={labels.edit}
            disabled={disabled}
            onClick={() => onEdit(address)}
          >
            <SquarePen className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            className={ICON_BUTTON}
            aria-label={labels.delete}
            disabled={disabled}
            onClick={() => onDelete(address.id)}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      {!address.isDefaultShipping ? (
        <div className="mt-auto pt-5">
          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => onSetDefault(address.id)}
            disabled={disabled}
          >
            {labels.setDefault}
          </button>
        </div>
      ) : null}
    </article>
  );
}
