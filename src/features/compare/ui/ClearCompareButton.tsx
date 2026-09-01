"use client";

import { useRouter } from "next/navigation";

import { clearCompareAction } from "@/features/compare/actions";
import { adjustCompareCountDelta } from "@/features/compare/compare-client-sync";

type ClearCompareButtonProps = {
  label: string;
  itemCount: number;
  className?: string;
};

export function ClearCompareButton({
  label,
  itemCount,
  className = "",
}: ClearCompareButtonProps) {
  const router = useRouter();

  function handleClick(): void {
    adjustCompareCountDelta(-itemCount);
    void clearCompareAction().then((result) => {
      if (!result.ok) {
        adjustCompareCountDelta(itemCount);
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`text-sm font-medium text-gray-700 underline-offset-2 hover:underline ${className}`}
    >
      {label}
    </button>
  );
}
