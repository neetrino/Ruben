"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { clearCompareAction } from "@/features/compare/actions";

type ClearCompareButtonProps = {
  label: string;
  className?: string;
};

export function ClearCompareButton({
  label,
  className = "",
}: ClearCompareButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick(): void {
    startTransition(async () => {
      const result = await clearCompareAction();
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
      className={`text-sm font-medium text-gray-700 underline-offset-2 hover:underline disabled:opacity-60 ${className}`}
    >
      {label}
    </button>
  );
}
