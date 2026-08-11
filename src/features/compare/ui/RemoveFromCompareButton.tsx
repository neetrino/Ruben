"use client";

import type { MouseEvent } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { toggleCompareAction } from "@/features/compare/actions";

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
  const [pending, startTransition] = useTransition();

  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    event.stopPropagation();

    startTransition(async () => {
      const result = await toggleCompareAction(productId);
      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-full transition disabled:opacity-60 ${className}`}
    >
      <X className="h-4 w-4" aria-hidden />
    </button>
  );
}
