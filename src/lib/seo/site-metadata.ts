import type { Metadata } from "next";

import hyCommon from "@/locales/hy/common.json";

export const SITE_NAME = "Ruben";
export const DEFAULT_PUBLIC_APP_URL = "https://rubengroup.am";
const OG_IMAGE_PATH = "/og-image.png";
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

const OPEN_GRAPH_LOCALE: Record<string, string> = {
  hy: "hy_AM",
  en: "en_US",
  ru: "ru_RU",
};

/** Public origin for absolute OG/Twitter URLs. Empty env falls back to production. */
export function resolvePublicAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || DEFAULT_PUBLIC_APP_URL;
}

/** Builds metadataBase from the public app URL. */
export function getMetadataBase(appUrl: string): URL {
  const normalized = appUrl.endsWith("/") ? appUrl : `${appUrl}/`;
  return new URL(normalized);
}

export function getShareImageUrl(appUrl: string): string {
  return new URL(OG_IMAGE_PATH, getMetadataBase(appUrl)).toString();
}

export function getShareOpenGraphImage(appUrl: string): {
  url: string;
  width: number;
  height: number;
  alt: string;
  type: "image/png";
} {
  return {
    url: getShareImageUrl(appUrl),
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: SITE_NAME,
    type: "image/png",
  };
}

function createShareImageMetadata(
  appUrl: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  const shareImage = getShareOpenGraphImage(appUrl);

  return {
    openGraph: {
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      images: [shareImage.url],
    },
  };
}

/** Site-wide defaults for link previews (Telegram, WhatsApp, Facebook). */
export function createRootMetadata(appUrl: string): Metadata {
  const description = hyCommon.seo.description;
  const share = createShareImageMetadata(appUrl);

  return {
    metadataBase: getMetadataBase(appUrl),
    title: {
      default: SITE_NAME,
      template: `%s · ${SITE_NAME}`,
    },
    description,
    applicationName: SITE_NAME,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: SITE_NAME,
      description,
      locale: "hy_AM",
      alternateLocale: ["en_US", "ru_RU"],
      ...share.openGraph,
    },
    twitter: {
      title: SITE_NAME,
      description,
      ...share.twitter,
    },
  };
}

/** Locale-aware description and Open Graph locale for storefront pages. */
export function createLocaleMetadata(
  locale: string,
  description: string,
  appUrl: string,
): Metadata {
  const ogLocale = OPEN_GRAPH_LOCALE[locale] ?? "hy_AM";
  const share = createShareImageMetadata(appUrl);

  return {
    description,
    openGraph: {
      description,
      locale: ogLocale,
      title: SITE_NAME,
      ...share.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      description,
      title: SITE_NAME,
      ...share.twitter,
    },
  };
}
