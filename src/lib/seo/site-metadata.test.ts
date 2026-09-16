import { describe, expect, it } from "vitest";

import {
  createLocaleMetadata,
  createRootMetadata,
  getShareImageUrl,
  getShareOpenGraphImage,
} from "@/lib/seo/site-metadata";

describe("site metadata", () => {
  it("uses a static PNG with an absolute URL for link previews", () => {
    expect(getShareImageUrl("https://rubengroup.am")).toBe(
      "https://rubengroup.am/og-image.png",
    );
    expect(getShareOpenGraphImage("https://rubengroup.am")).toEqual({
      url: "https://rubengroup.am/og-image.png",
      width: 1200,
      height: 630,
      alt: "Ruben",
      type: "image/png",
    });

    const metadata = createRootMetadata("https://rubengroup.am");
    expect(metadata.applicationName).toBe("Ruben");
    expect(metadata.openGraph?.siteName).toBe("Ruben");
    expect(metadata.openGraph?.locale).toBe("hy_AM");
  });

  it("keeps the share image when locale metadata is applied", () => {
    const metadata = createLocaleMetadata(
      "hy",
      "Միջազգային որակ՝ ձեր ինտերիերի համար։",
      "https://rubengroup.am",
    );

    expect(metadata.description).toBe(
      "Միջազգային որակ՝ ձեր ինտերիերի համար։",
    );
    expect(metadata.openGraph?.locale).toBe("hy_AM");
    expect(metadata.openGraph?.images).toEqual([
      getShareOpenGraphImage("https://rubengroup.am"),
    ]);
  });
});
