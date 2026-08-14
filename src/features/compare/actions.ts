"use server";

import { clearCompare, toggleCompare } from "@/features/compare/queries";
import { err, ok, type Result } from "@/lib/result";

export async function toggleCompareAction(
  productId: string,
): Promise<Result<{ inCompare: boolean }>> {
  try {
    const result = await toggleCompare(productId);
    return ok(result);
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    if (code === "UNAUTHENTICATED") {
      return err("UNAUTHENTICATED", "Sign in to compare products.");
    }
    if (code === "PRODUCT_UNAVAILABLE") {
      return err("PRODUCT_UNAVAILABLE", "Product unavailable.");
    }
    if (code === "COMPARE_LIMIT") {
      return err(
        "COMPARE_LIMIT",
        "Compare list is full. Remove a product first.",
      );
    }
    return err("COMPARE_FAILED", "Unable to update compare list.");
  }
}

export async function clearCompareAction(): Promise<Result<null>> {
  try {
    await clearCompare();
    return ok(null);
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    if (code === "UNAUTHENTICATED") {
      return err("UNAUTHENTICATED", "Sign in to compare products.");
    }
    return err("COMPARE_FAILED", "Unable to clear compare list.");
  }
}
