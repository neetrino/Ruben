import { describe, expect, it } from "vitest";

import { getDictionary } from "@/lib/i18n/get-dictionary";

describe("site share description", () => {
  it("exposes the link-preview copy for each locale", () => {
    expect(getDictionary("hy").seo.description).toBe(
      "Միջազգային որակ՝ ձեր ինտերիերի համար։",
    );
    expect(getDictionary("en").seo.description).toBe(
      "International quality — for your interior.",
    );
    expect(getDictionary("ru").seo.description).toBe(
      "Международное качество — для вашего интерьера.",
    );
  });
});
