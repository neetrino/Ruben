export type PresignedUpload = {
  objectKey: string;
  uploadUrl: string;
  expiresAt: Date;
};

export type PutObjectInput = {
  objectKey: string;
  body: Buffer;
  contentType: string;
};

export type StoredObject = {
  body: ReadableStream<Uint8Array>;
  contentType: string;
  contentLength: number | null;
  etag: string | null;
};

export type ObjectStorageAdapter = {
  readonly name: string;
  createPresignedUpload(input: {
    objectKey: string;
    contentType: string;
    maxBytes: number;
  }): Promise<PresignedUpload>;
  putObject(input: PutObjectInput): Promise<void>;
  /** Streams a stored object, or `null` when the key does not exist. */
  getObject(objectKey: string): Promise<StoredObject | null>;
  buildPublicUrl(objectKey: string): string;
  deleteObject(objectKey: string): Promise<void>;
};
