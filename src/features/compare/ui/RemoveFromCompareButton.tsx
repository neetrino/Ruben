"use client";

import type { MouseEvent } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { toggleCompareAction } from "@/features/compare/actions";
import {
  adjustCompareCountDelta,
  setCompareOverride,
} from "@/features/compare/compare-client-sync";

type RemoveFromCompareButtonProps = {
  productId: string;
  label: string;
  className?: string;
};

export function RemoveFromCompareButton({
  productId,
  label,
  className = "",
}: RemoveFromCompareButtonProps) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    event.stopPropagation();

    adjustCompareCountDelta(-1);
    setCompareOverride(productId, false);
    void toggleCompareAction(productId).then((result) => {
      if (!result.ok) {
        adjustCompareCountDelta(1);
        setCompareOverride(productId, true);
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-full transition ${className}`}
    >
      <X className="h-4 w-4" aria-hidden />
    </button>
  );
}
