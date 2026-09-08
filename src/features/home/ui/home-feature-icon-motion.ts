export type HomeFeatureIconMotionKind =
  | "float"
  | "floatSoft"
  | "bounce"
  | "sway";

export const HOME_FEATURE_ICON_MOTION_TIMING = {
  float: { durationMs: 5200, delayMs: 0 },
  floatSoft: { durationMs: 6800, delayMs: 900 },
  bounce: { durationMs: 4200, delayMs: 350 },
  sway: { durationMs: 5800, delayMs: 1200 },
} as const satisfies Record<
  HomeFeatureIconMotionKind,
  { durationMs: number; delayMs: number }
>;
