"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type LazyWhenVisibleProps = {
  children: ReactNode;
  fallback?: ReactNode;
  /** IntersectionObserver rootMargin; load slightly before entering the viewport. */
  rootMargin?: string;
  className?: string;
};

/**
 * Defers mounting children until the placeholder is near the viewport.
 * First paint (SSR + hydrate) shows `fallback` to avoid hydration mismatch.
 */
export function LazyWhenVisible({
  children,
  fallback = null,
  rootMargin = "240px 0px",
  className,
}: LazyWhenVisibleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || shouldLoad) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => {
        setShouldLoad(true);
      });
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad, rootMargin]);

  return (
    <div ref={containerRef} className={className}>
      {shouldLoad ? children : fallback}
    </div>
  );
}
