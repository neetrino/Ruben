"use client";

import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

const TOP_REVEAL_Y = 8;
/** Scroll down past this → hide primary row. */
const HIDE_DELTA = 14;
/** Scroll up past this → show primary row. */
const SHOW_DELTA = 14;
/** Ignore opposite direction while the open/close animation runs. */
const TOGGLE_LOCK_MS = 420;
/** Live sticky header height for sticky rails / checkout summary. */
export const STOREFRONT_HEADER_OFFSET_VAR = "--storefront-header-offset";

type UseStorefrontHeaderScrollCollapseResult = {
  primaryHidden: boolean;
  allowMotion: boolean;
  scrollHomeToTop: () => void;
};

/**
 * Grill-style sticky chrome: collapse primary row on scroll down, reveal on up.
 * No scrollY compensation (avoids flicker). Lock direction during toggle animation.
 */
export function useStorefrontHeaderScrollCollapse(
  headerRootRef: RefObject<HTMLElement | null>,
): UseStorefrontHeaderScrollCollapseResult {
  const pathname = usePathname();

  const [primaryHidden, setPrimaryHidden] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [routePathname, setRoutePathname] = useState(pathname);
  const [scrollLocked, setScrollLocked] = useState(false);

  const lastScrollYRef = useRef(0);
  const primaryHiddenRef = useRef(false);
  const motionEnabledRef = useRef(false);
  const toggleLockUntilRef = useRef(0);
  const programmaticScrollRef = useRef(false);
  const programmaticScrollTimerRef = useRef<number | null>(null);
  const motionEnableTimerRef = useRef<number | null>(null);

  if (routePathname !== pathname) {
    setRoutePathname(pathname);
    setPrimaryHidden(false);
    setMotionEnabled(false);
  }

  function clearProgrammaticScrollTimer(): void {
    if (programmaticScrollTimerRef.current != null) {
      window.clearTimeout(programmaticScrollTimerRef.current);
      programmaticScrollTimerRef.current = null;
    }
  }

  function clearMotionEnableTimer(): void {
    if (motionEnableTimerRef.current != null) {
      window.clearTimeout(motionEnableTimerRef.current);
      motionEnableTimerRef.current = null;
    }
  }

  function armMotion(): void {
    clearMotionEnableTimer();
    motionEnableTimerRef.current = window.setTimeout(() => {
      motionEnabledRef.current = true;
      setMotionEnabled(true);
      motionEnableTimerRef.current = null;
    }, 50);
  }

  function setPrimaryHiddenState(nextHidden: boolean, animate: boolean): void {
    if (primaryHiddenRef.current === nextHidden) {
      return;
    }

    if (!animate) {
      clearMotionEnableTimer();
      motionEnabledRef.current = false;
      setMotionEnabled(false);
    } else if (!motionEnabledRef.current) {
      motionEnabledRef.current = true;
      setMotionEnabled(true);
    }

    primaryHiddenRef.current = nextHidden;
    setPrimaryHidden(nextHidden);
    toggleLockUntilRef.current = Date.now() + TOGGLE_LOCK_MS;

    if (!animate) {
      armMotion();
    }
  }

  function unlockProgrammaticScroll(): void {
    clearProgrammaticScrollTimer();
    programmaticScrollRef.current = false;
    lastScrollYRef.current = window.scrollY;
    setScrollLocked(false);
    armMotion();
  }

  function scrollHomeToTop(): void {
    clearProgrammaticScrollTimer();
    clearMotionEnableTimer();

    programmaticScrollRef.current = true;
    setScrollLocked(true);
    motionEnabledRef.current = false;
    setMotionEnabled(false);

    if (primaryHiddenRef.current) {
      primaryHiddenRef.current = false;
      setPrimaryHidden(false);
    }

    if (window.scrollY <= TOP_REVEAL_Y) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      programmaticScrollTimerRef.current = window.setTimeout(() => {
        unlockProgrammaticScroll();
      }, 100);
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    function onScrollEnd(): void {
      window.removeEventListener("scrollend", onScrollEnd);
      clearProgrammaticScrollTimer();
      programmaticScrollTimerRef.current = window.setTimeout(() => {
        unlockProgrammaticScroll();
      }, 120);
    }

    window.addEventListener("scrollend", onScrollEnd, { once: true });
    programmaticScrollTimerRef.current = window.setTimeout(() => {
      window.removeEventListener("scrollend", onScrollEnd);
      unlockProgrammaticScroll();
    }, 1200);
  }

  useLayoutEffect(() => {
    primaryHiddenRef.current = primaryHidden;
    motionEnabledRef.current = motionEnabled;
  }, [primaryHidden, motionEnabled]);

  useLayoutEffect(() => {
    const headerRoot = headerRootRef.current;
    if (!headerRoot) {
      return;
    }

    function publishHeaderOffset(): void {
      const el = headerRootRef.current;
      if (!el) {
        return;
      }
      document.documentElement.style.setProperty(
        STOREFRONT_HEADER_OFFSET_VAR,
        `${Math.ceil(el.offsetHeight)}px`,
      );
    }

    publishHeaderOffset();
    const observer = new ResizeObserver(publishHeaderOffset);
    observer.observe(headerRoot);

    return () => {
      observer.disconnect();
    };
  }, [headerRootRef]);

  useLayoutEffect(() => {
    lastScrollYRef.current = window.scrollY;
    primaryHiddenRef.current = false;
    toggleLockUntilRef.current = 0;
    armMotion();
    return () => {
      clearMotionEnableTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- route entry only
  }, [pathname]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    function onScroll(): void {
      const y = window.scrollY;

      if (programmaticScrollRef.current) {
        lastScrollYRef.current = y;
        return;
      }

      const delta = y - lastScrollYRef.current;
      lastScrollYRef.current = y;

      if (y <= TOP_REVEAL_Y) {
        setPrimaryHiddenState(false, motionEnabledRef.current);
        return;
      }

      if (Date.now() < toggleLockUntilRef.current) {
        return;
      }

      if (delta >= HIDE_DELTA) {
        setPrimaryHiddenState(true, true);
      } else if (delta <= -SHOW_DELTA) {
        setPrimaryHiddenState(false, true);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearMotionEnableTimer();
      clearProgrammaticScrollTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- listeners once; refs hold latest
  }, []);

  return {
    primaryHidden,
    allowMotion: motionEnabled && !scrollLocked,
    scrollHomeToTop,
  };
}
