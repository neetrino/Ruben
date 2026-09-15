import "server-only";

import { and, asc, eq, inArray, or } from "drizzle-orm";

import { getDb } from "@/db/client";
import { mediaAssets } from "@/db/schema";
import { mediaPublicUrl } from "@/lib/media/public-url";

/** Primary (or PRIMARY-role) READY media object keys by product id. */
export async function getPrimaryProductImageKeys(
  productIds: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (productIds.length === 0) {
    return map;
  }

  const rows = await getDb()
    .select({
      productId: mediaAssets.productId,
      objectKey: mediaAssets.objectKey,
    })
    .from(mediaAssets)
    .where(
      and(
        inArray(mediaAssets.productId, productIds),
        eq(mediaAssets.uploadStatus, "READY"),
        or(eq(mediaAssets.isPrimary, true), eq(mediaAssets.role, "PRIMARY")),
      ),
    )
    .orderBy(asc(mediaAssets.sortOrder));

  for (const row of rows) {
    if (!row.productId || map.has(row.productId)) {
      continue;
    }
    map.set(row.productId, row.objectKey);
  }

  return map;
}

/** Primary product image public URLs by product id. */
export async function getPrimaryProductImageUrls(
  productIds: string[],
): Promise<Map<string, string>> {
  const keys = await getPrimaryProductImageKeys(productIds);
  const urls = new Map<string, string>();
  for (const [productId, objectKey] of keys) {
    urls.set(productId, mediaPublicUrl(objectKey));
  }
  return urls;
}
