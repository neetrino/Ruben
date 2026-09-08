"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { logger } from "@/lib/observability/logger";

const COPIED_FEEDBACK_MS = 1600;

type CopyTextButtonProps = {
  /** Text written to the clipboard. */
  value: string;
  /** Accessible label in idle state. */
  copyLabel: string;
  /** Accessible label right after a successful copy. */
  copiedLabel: string;
  className?: string;
};

/** Copies `value` to the clipboard on click and confirms with a check icon. */
export function CopyTextButton({
  value,
  copyLabel,
  copiedLabel,
  className,
}: CopyTextButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  async function copyValue(): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
    } catch (caught) {
      logger.warn("clipboard.write_failed", {
        reason: caught instanceof Error ? caught.message : "unknown",
      });
      return;
    }

    setCopied(true);
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  }

  return (
    <button
      type="button"
      onClick={() => void copyValue()}
      title={copied ? copiedLabel : copyLabel}
      aria-label={`${copied ? copiedLabel : copyLabel}: ${value}`}
      className={`group inline-flex items-center gap-1.5 rounded outline-none ${className ?? ""}`}
    >
      <span>{value}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-green-600" aria-hidden />
      ) : (
        <Copy
          className="h-3.5 w-3.5 shrink-0 text-gray-400 transition-colors group-hover:text-gray-700"
          aria-hidden
        />
      )}
    </button>
  );
}
