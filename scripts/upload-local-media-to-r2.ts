import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config as loadEnv } from "dotenv";

import { imageMimeForExtension } from "@/lib/media/image-file";

loadEnv({ path: path.resolve(process.cwd(), ".env") });

const UPLOADS_ROOT = path.resolve(process.cwd(), "public", "uploads");

type R2Config = {
  bucketName: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
};

function readR2Config(): R2Config {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error(
      "R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET_NAME are required",
    );
  }

  return {
    bucketName,
    accessKeyId,
    secretAccessKey,
    endpoint:
      process.env.R2_ENDPOINT?.replace(/\/$/, "") ??
      `https://${accountId}.r2.cloudflarestorage.com`,
  };
}

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolute = path.join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(absolute) : [absolute];
    }),
  );
  return files.flat();
}

/**
 * Uploads files written by the local stub storage adapter into R2 using the
 * same object keys stored in the database. Safe to re-run: puts are idempotent.
 */
async function uploadLocalMedia(): Promise<void> {
  const config = readR2Config();
  const client = new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  const files = await collectFiles(UPLOADS_ROOT);
  if (files.length === 0) {
    process.stdout.write("No local uploads found.\n");
    return;
  }

  for (const absolute of files) {
    const objectKey = path
      .relative(path.resolve(process.cwd(), "public"), absolute)
      .split(path.sep)
      .join("/");

    await client.send(
      new PutObjectCommand({
        Bucket: config.bucketName,
        Key: objectKey,
        Body: await readFile(absolute),
        ContentType: imageMimeForExtension(path.extname(absolute)),
      }),
    );
    process.stdout.write(`uploaded ${objectKey}\n`);
  }

  process.stdout.write(`Done. ${files.length} object(s) uploaded.\n`);
}

uploadLocalMedia().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
