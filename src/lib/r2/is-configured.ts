type R2Credentials = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
};

/**
 * True when all required R2 credentials are present for the real adapter.
 * `R2_PUBLIC_BASE_URL` is intentionally excluded: without it objects are served
 * through the app's media route instead of a public CDN origin.
 */
export function isR2Configured(
  input: Partial<R2Credentials>,
): input is R2Credentials {
  return Boolean(
    input.accountId &&
      input.accessKeyId &&
      input.secretAccessKey &&
      input.bucketName,
  );
}
