const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const MEDIA_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export function extensionForImageMime(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/gif") return "gif";
  return "jpg";
}

/** Inverse of {@link extensionForImageMime}, for objects served from storage. */
export function imageMimeForExtension(extension: string): string {
  const normalized = extension.toLowerCase().replace(/^\./, "");
  if (normalized === "png") return "image/png";
  if (normalized === "webp") return "image/webp";
  if (normalized === "gif") return "image/gif";
  return "image/jpeg";
}

/** Validates MIME and size for admin image uploads. */
export function validateImageFile(
  file: File,
  maxBytes = MEDIA_IMAGE_MAX_BYTES,
): string | null {
  if (!ALLOWED_MIME.has(file.type)) {
    return "Only JPEG, PNG, WebP, or GIF images are allowed.";
  }
  if (file.size > maxBytes) {
    return `Image must be ${Math.floor(maxBytes / (1024 * 1024))}MB or smaller.`;
  }
  return null;
}
