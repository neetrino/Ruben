import { describe, expect, it } from "vitest";

import {
  formatAnalyticsDisplayDate,
  matchAnalyticsPeriodPreset,
  rangeForAnalyticsPeriod,
} from "@/features/analytics/domain/date-range";

describe("rangeForAnalyticsPeriod", () => {
  it("returns a single-day window for today", () => {
    const range = rangeForAnalyticsPeriod("today");
    expect(range.from).toBe(range.to);
  });

  it("returns an inclusive this-week window starting on Monday", () => {
    const range = rangeForAnalyticsPeriod("this_week");
    const start = new Date(`${range.from}T00:00:00.000Z`);
    expect(start.getUTCDay()).toBe(1);
    expect(range.from <= range.to).toBe(true);
  });

  it("matches preset detection for generated ranges", () => {
    const range = rangeForAnalyticsPeriod("this_month");
    expect(matchAnalyticsPeriodPreset(range)).toBe("this_month");
  });
});

describe("formatAnalyticsDisplayDate", () => {
  it("formats UTC ISO dates for headers", () => {
    expect(formatAnalyticsDisplayDate("2026-07-12")).toBe("Jul 12, 2026");
  });
});
