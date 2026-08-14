import { copyFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";
import { seedIds } from "@/db/seed/ids";

type SeedProductImage = {
  mediaId: string;
  productId: string;
  fileName: string;
  alt: { hy: string; en: string; ru: string };
};

const ELECTRONICS_IMAGES: SeedProductImage[] = [
  {
    mediaId: seedIds.mediaWirelessEarbuds,
    productId: seedIds.productWirelessEarbuds,
    fileName: "wireless-earbuds.jpg",
    alt: {
      hy: "Անլար ականջակալներ",
      en: "Wireless earbuds",
      ru: "Беспроводные наушники",
    },
  },
  {
    mediaId: seedIds.mediaSmartWatch,
    productId: seedIds.productSmartWatch,
    fileName: "smart-watch.jpg",
    alt: {
      hy: "Խելացի ժամացույց",
      en: "Smart watch",
      ru: "Умные часы",
    },
  },
  {
    mediaId: seedIds.mediaUsbCHub,
    productId: seedIds.productUsbCHub,
    fileName: "usb-c-hub.jpg",
    alt: {
      hy: "USB-C հաբ",
      en: "USB-C hub",
      ru: "USB-C хаб",
    },
  },
  {
    mediaId: seedIds.mediaPowerBank,
    productId: seedIds.productPowerBank,
    fileName: "power-bank.jpg",
    alt: {
      hy: "Power bank",
      en: "Power bank",
      ru: "Power bank",
    },
  },
  {
    mediaId: seedIds.mediaBluetoothSpeaker,
    productId: seedIds.productBluetoothSpeaker,
    fileName: "bluetooth-speaker.jpg",
    alt: {
      hy: "Bluetooth բարձրախոս",
      en: "Bluetooth speaker",
      ru: "Bluetooth-колонка",
    },
  },
];

/**
 * Copies seed electronics images into `public/uploads` and upserts media rows.
 * Safe to re-run; skips missing asset files with a warning.
 */
export async function seedElectronicsProductImages(
  databaseUrl: string,
): Promise<string[]> {
  const db = drizzle(neon(databaseUrl), { schema });
  const assetsDir = path.resolve(
    process.cwd(),
    "src/db/seed/assets/electronics",
  );
  const readySkus: string[] = [];

  for (const image of ELECTRONICS_IMAGES) {
    const sourcePath = path.join(assetsDir, image.fileName);
    let fileStat;
    try {
      fileStat = await stat(sourcePath);
    } catch {
      console.warn(
        JSON.stringify({
          level: "warn",
          message: "seed.media.asset_missing",
          fileName: image.fileName,
        }),
      );
      continue;
    }

    const objectKey = `uploads/products/${image.productId}/${image.mediaId}.jpg`;
    const publicPath = path.join(process.cwd(), "public", objectKey);
    await mkdir(path.dirname(publicPath), { recursive: true });
    await copyFile(sourcePath, publicPath);

    await db
      .insert(schema.mediaAssets)
      .values({
        id: image.mediaId,
        objectKey,
        mimeType: "image/jpeg",
        byteSize: fileStat.size,
        uploadStatus: "READY",
        role: "PRIMARY",
        sortOrder: 0,
        isPrimary: true,
        productId: image.productId,
        altTranslations: image.alt,
      })
      .onConflictDoUpdate({
        target: schema.mediaAssets.id,
        set: {
          objectKey,
          mimeType: "image/jpeg",
          byteSize: fileStat.size,
          uploadStatus: "READY",
          role: "PRIMARY",
          isPrimary: true,
          productId: image.productId,
          altTranslations: image.alt,
          updatedAt: new Date(),
        },
      });

    readySkus.push(image.fileName);
  }

  return readySkus;
}
