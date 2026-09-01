"use client";

import { useEffect, useSyncExternalStore } from "react";

type Listener = () => void;

type CompareClientSnapshot = {
  /** Optimistic membership per product id, until the RSC payload catches up. */
  overrides: ReadonlyMap<string, boolean>;
  /** Pending badge delta applied on top of the latest server count. */
  countDelta: number;
};

let snapshot: CompareClientSnapshot = {
  overrides: new Map(),
  countDelta: 0,
};
const listeners = new Set<Listener>();

function setSnapshot(next: CompareClientSnapshot): void {
  snapshot = next;
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeCompareSync(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Optimistically mark a product as in compare for every mounted button. */
export function setCompareOverride(
  productId: string,
  inCompare: boolean,
): void {
  if (snapshot.overrides.get(productId) === inCompare) {
    return;
  }
  const overrides = new Map(snapshot.overrides);
  overrides.set(productId, inCompare);
  setSnapshot({ ...snapshot, overrides });
}

/** Drop an override once the server payload reports the same value. */
export function clearCompareOverride(productId: string): void {
  if (!snapshot.overrides.has(productId)) {
    return;
  }
  const overrides = new Map(snapshot.overrides);
  overrides.delete(productId);
  setSnapshot({ ...snapshot, overrides });
}

/** Shift the badge count before the server responds (`+1` / `-1`). */
export function adjustCompareCountDelta(delta: number): void {
  if (delta === 0) {
    return;
  }
  setSnapshot({ ...snapshot, countDelta: snapshot.countDelta + delta });
}

function resetCompareCountDelta(): void {
  if (snapshot.countDelta === 0) {
    return;
  }
  setSnapshot({ ...snapshot, countDelta: 0 });
}

/**
 * Compare state for one product: optimistic value wins until the server agrees.
 */
export function useCompareMembership(
  productId: string,
  serverInCompare: boolean,
): boolean {
  const override = useSyncExternalStore(
    subscribeCompareSync,
    () => snapshot.overrides.get(productId),
    () => undefined,
  );

  useEffect(() => {
    if (override === serverInCompare) {
      clearCompareOverride(productId);
    }
  }, [override, productId, serverInCompare]);

  return override ?? serverInCompare;
}

/**
 * Badge count: server count plus pending local toggles. The delta resets as
 * soon as a fresh server count arrives, so both stay in sync after `refresh()`.
 */
export function useCompareCount(serverCount: number): number {
  const countDelta = useSyncExternalStore(
    subscribeCompareSync,
    () => snapshot.countDelta,
    () => 0,
  );

  useEffect(() => {
    resetCompareCountDelta();
  }, [serverCount]);

  return Math.max(0, serverCount + countDelta);
}

/** Test helper — resets module state between unit tests. */
export function resetCompareClientSyncForTests(): void {
  snapshot = { overrides: new Map(), countDelta: 0 };
  for (const listener of listeners) {
    listener();
  }
}
