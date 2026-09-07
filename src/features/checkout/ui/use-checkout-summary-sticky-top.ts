"use client";

import { useEffect, useState } from "react";

const SUMMARY_HEADER_GAP_PX = 16;
const SUMMARY_FALLBACK_TOP_PX = 140;

function resolveStorefrontHeader(): HTMLElement | null {
  const desktop = document.querySelector<HTMLElement>("[data-site-header]");
  if (desktop && desktop.getClientRects().length > 0) {
    return desktop;
  }
  return document.querySelector<HTMLElement>(
    "[data-storefront-mobile-top-bar]",
  );
}

/** Sticky offset for order summary — tracks live site header height. */
export function useCheckoutSummaryStickyTop(): number {
  const [top, setTop] = useState(SUMMARY_FALLBACK_TOP_PX);

  useEffect(() => {
    function update(): void {
      const header = resolveStorefrontHeader();
      if (!header) {
        setTop(SUMMARY_FALLBACK_TOP_PX);
        return;
      }
      setTop(
        Math.round(header.getBoundingClientRect().bottom + SUMMARY_HEADER_GAP_PX),
      );
    }

    update();
    window.addEventListener("resize", update);
    const header = resolveStorefrontHeader();
    const observer = header ? new ResizeObserver(update) : null;
    if (header && observer) {
      observer.observe(header);
    }

    return () => {
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, []);

  return top;
}
