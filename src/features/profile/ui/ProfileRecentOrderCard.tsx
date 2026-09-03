"use client";

import type { KeyboardEvent } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";

type ProfileRecentOrderCardProps = {
  orderNumber: string;
  status: string;
  totalLabel: string;
  metaLine: string;
  placedOnLine: string;
  orderNumberLabel: string;
  viewDetailsLabel: string;
  onViewDetails: () => void;
};

function handleCardKeyDown(
  event: KeyboardEvent<HTMLElement>,
  onViewDetails: () => void,
): void {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onViewDetails();
  }
}

/** Dashboard recent-order card — Kamancha layout with Ruben brand accents. */
export function ProfileRecentOrderCard({
  orderNumber,
  status,
  totalLabel,
  metaLine,
  placedOnLine,
  orderNumberLabel,
  viewDetailsLabel,
  onViewDetails,
}: ProfileRecentOrderCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onViewDetails}
      onKeyDown={(event) => handleCardKeyDown(event, onViewDetails)}
      className="profile-order-card flex h-full w-full min-w-0 cursor-pointer flex-col items-stretch rounded-2xl border border-gray-200/80 bg-white p-4 text-left transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-wide text-gray-900 uppercase">
            {orderNumberLabel} {orderNumber}
          </h3>
          <p className="mt-2 text-lg leading-none font-bold tracking-wide text-black sm:text-xl">
            {totalLabel}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-800">
          {status}
        </span>
      </div>

      <div className="my-4 h-px rounded-full bg-gray-200" aria-hidden />

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-black">
          <ShoppingBag className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 pt-0.5 text-sm leading-snug text-gray-700">
          <p>{metaLine}</p>
          <p className="whitespace-nowrap">{placedOnLine}</p>
        </div>
      </div>

      <div className="mt-auto hidden w-full self-stretch pt-5 sm:block">
        <div
          className="profile-order-card-cta box-border flex w-full min-w-0 items-center gap-2 rounded-full bg-[var(--brand)] py-0.5 pr-0.5 pl-3 text-xs font-bold tracking-wide text-black uppercase"
          aria-hidden
        >
          <span className="min-w-0 flex-1 truncate text-center">
            {viewDetailsLabel}
          </span>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-black/10 text-black">
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}
