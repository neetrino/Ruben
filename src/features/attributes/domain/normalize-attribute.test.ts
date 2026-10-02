import { describe, expect, it } from "vitest";

import {
  normalizeSwatchHex,
  slugifyAttributeCode,
} from "@/features/attributes/domain/normalize-attribute";

describe("slugifyAttributeCode", () => {
  it("builds a stable lowercase code from a title", () => {
    expect(slugifyAttributeCode("Shoe Size")).toBe("shoe-size");
  });
});

describe("normalizeSwatchHex", () => {
  it("normalizes valid hex colors to uppercase #RRGGBB", () => {
    expect(normalizeSwatchHex("#ab12cd")).toBe("#AB12CD");
    expect(normalizeSwatchHex("ff0000")).toBe("#FF0000");
  });

  it("rejects invalid hex colors", () => {
    expect(normalizeSwatchHex("#fff")).toBeNull();
    expect(normalizeSwatchHex("red")).toBeNull();
  });
});
