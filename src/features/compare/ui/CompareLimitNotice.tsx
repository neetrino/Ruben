"use client";

import { useEffect, useState, type AnimationEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import enCompare from "@/locales/en/compare.json";
import hyCompare from "@/locales/hy/compare.json";
import ruCompare from "@/locales/ru/compare.json";
import type { Locale } from "@/lib/i18n/config";
import { useIsClient } from "@/lib/react/use-is-client";

/** Matches confirm-dialog panel-out (280ms) with a short fallback. */
const NOTICE_EXIT_MS = 320;

const COMPARE_COPY = {
  hy: hyCompare,
  en: enCompare,
  ru: ruCompare,
} as const;

type CompareLimitNoticeProps = {
  open: boolean;
  locale: Locale;
  message: string;
  onClose: () => void;
};

/**
 * Storefront notice for a full compare list. Reuses the confirm-dialog
 * fade/rise so open and close stay smooth, with a close control and OK.
 */
export function CompareLimitNotice({
  open,
  locale,
  message,
  onClose,
}: CompareLimitNoticeProps) {
  const mounted = useIsClient();
  const copy = COMPARE_COPY[locale];
  const [rendered, setRendered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(message);
  const [trackedOpen, setTrackedOpen] = useState(open);

  if (trackedOpen !== open || (open && displayMessage !== message)) {
    setTrackedOpen(open);
    if (open) {
      setDisplayMessage(message);
      setExiting(false);
      setRendered(true);
    } else if (rendered) {
      setExiting(true);
    }
  }

  useEffect(() => {
    if (open || !exiting) return;
    const timer = window.setTimeout(() => {
      setRendered(false);
      setExiting(false);
    }, NOTICE_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open, exiting]);

  useEffect(() => {
    if (!rendered) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key !== "Escape") return;
      onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [rendered, onClose]);

  function finishExit(): void {
    setRendered(false);
    setExiting(false);
  }

  function handlePanelAnimationEnd(event: AnimationEvent<HTMLDivElement>): void {
    if (event.target !== event.currentTarget) return;
    if (!event.animationName.includes("confirm-dialog-panel-out")) return;
    finishExit();
  }

  if (!mounted || !rendered) return null;

  const backdropClass = exiting
    ? "animate-confirm-dialog-backdrop-out"
    : "animate-confirm-dialog-backdrop-in";
  const panelClass = exiting
    ? "animate-confirm-dialog-panel-out"
    : "animate-confirm-dialog-panel-in";

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="compare-limit-notice-message"
    >
      <button
        type="button"
        className={`absolute inset-0 cursor-pointer bg-black/40 ${backdropClass}`}
        aria-label={copy.close}
        onClick={onClose}
      />
      <div
        className={`relative z-[1] w-full max-w-md rounded-3xl bg-white p-6 shadow-xl ${panelClass}`}
        onAnimationEnd={handlePanelAnimationEnd}
      >
        <button
          type="button"
          aria-label={copy.close}
          onClick={onClose}
          className="absolute top-4 right-4 inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <X className="size-4" aria-hidden />
        </button>
        <p
          id="compare-limit-notice-message"
          className="pr-8 text-sm leading-relaxed text-gray-800"
        >
          {displayMessage}
        </p>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-bold text-black transition hover:brightness-95"
          >
            {copy.ok}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
