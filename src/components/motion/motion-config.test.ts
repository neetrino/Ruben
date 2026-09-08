import { describe, expect, it } from "vitest";

import {
  MOTION_MAX_STAGGER_ITEMS,
  MOTION_STAGGER_S,
  appearDelay,
} from "@/components/motion/motion-config";

describe("appearDelay", () => {
  it("scales linearly for items within the stagger cap", () => {
    expect(appearDelay(0)).toBe(0);
    expect(appearDelay(3)).toBe(3 * MOTION_STAGGER_S);
  });

  it("caps delay so long grids stay snappy", () => {
    expect(appearDelay(MOTION_MAX_STAGGER_ITEMS + 12)).toBe(
      MOTION_MAX_STAGGER_ITEMS * MOTION_STAGGER_S,
    );
  });
});
