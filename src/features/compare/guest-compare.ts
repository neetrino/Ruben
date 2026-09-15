import "server-only";

import { cookies } from "next/headers";

import { COMPARE_MAX_PRODUCTS } from "@/features/compare/constants";

export const GUEST_COMPARE_COOKIE_NAME = "ws_guest_compare";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30;

function parseGuestCompareIds(raw: string | undefined): string[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const ids: string[] = [];
    for (const value of parsed) {
      if (typeof value !== "string" || !UUID_RE.test(value)) {
        continue;
      }
      if (!ids.includes(value)) {
        ids.push(value);
      }
      if (ids.length >= COMPARE_MAX_PRODUCTS) {
        break;
      }
    }
    return ids;
  } catch {
    return [];
  }
}

/** Reads guest compare product IDs without creating a cookie. */
export async function peekGuestCompareIds(): Promise<string[]> {
  const cookieStore = await cookies();
  return parseGuestCompareIds(
    cookieStore.get(GUEST_COMPARE_COOKIE_NAME)?.value,
  );
}

/** Persists guest compare product IDs (newest-first order preserved by caller). */
export async function setGuestCompareIds(productIds: string[]): Promise<void> {
  const cookieStore = await cookies();
  const unique: string[] = [];
  for (const id of productIds) {
    if (!UUID_RE.test(id) || unique.includes(id)) {
      continue;
    }
    unique.push(id);
    if (unique.length >= COMPARE_MAX_PRODUCTS) {
      break;
    }
  }

  if (unique.length === 0) {
    cookieStore.delete(GUEST_COMPARE_COOKIE_NAME);
    return;
  }

  cookieStore.set(GUEST_COMPARE_COOKIE_NAME, JSON.stringify(unique), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SEC,
  });
}
