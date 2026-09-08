import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Returns the URL when it is remote or a present local `public/` file.
 * Missing stub `/uploads/...` files become `null` so UI can use a fallback.
 */
export function resolveExistingPublicMediaUrl(
  url: string | null | undefined,
): string | null {
  if (!url) {
    return null;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (!url.startsWith("/")) {
    return null;
  }

  const filePath = path.join(process.cwd(), "public", url);
  return existsSync(filePath) ? url : null;
}
