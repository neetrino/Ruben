import { NextResponse } from "next/server";

import { getProviders } from "@/config/providers";
import { logger } from "@/lib/observability/logger";

/**
 * Object keys are generated as `uploads/<scope>/<uuid>/<uuid>.<ext>`, so the
 * pattern excludes dots outside the extension and blocks path traversal.
 */
const ALLOWED_OBJECT_KEY = /^uploads\/[A-Za-z0-9/_-]+\.[A-Za-z0-9]+$/;

/** Keys embed a UUID and are never reused, so responses are immutable. */
const CACHE_CONTROL = "public, max-age=31536000, immutable";

/** Streams stored media so the storage bucket can stay private. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
): Promise<Response> {
  const { key } = await params;
  const objectKey = key.join("/");

  if (!ALLOWED_OBJECT_KEY.test(objectKey)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const stored = await getProviders().storage.getObject(objectKey);
    if (!stored) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const headers = new Headers({
      "Content-Type": stored.contentType,
      "Cache-Control": CACHE_CONTROL,
    });
    if (stored.contentLength != null) {
      headers.set("Content-Length", String(stored.contentLength));
    }
    if (stored.etag) {
      headers.set("ETag", stored.etag);
    }

    return new Response(stored.body, { status: 200, headers });
  } catch (error) {
    logger.error("media.stream_failed", {
      objectKey,
      message: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ error: "Media unavailable" }, { status: 502 });
  }
}
