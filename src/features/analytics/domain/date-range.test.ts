import { describe, expect, it } from "vitest";

import {
  matchAnalyticsPeriodPreset,
  rangeForAnalyticsPeriod,
} from "@/features/analytics/domain/date-range";

describe("rangeForAnalyticsPeriod", () => {
  it("returns a 7-day window for last_7_days", () => {
    const range = rangeForAnalyticsPeriod("last_7_days");
    const start = new Date(`${range.from}T00:00:00.000Z`);
    const end = new Date(`${range.to}T00:00:00.000Z`);
    const days =
      Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    expect(days).toBe(7);
    expect(range.from <= range.to).toBe(true);
  });

  it("returns a 30-day window for last_30_days", () => {
    const range = rangeForAnalyticsPeriod("last_30_days");
    const start = new Date(`${range.from}T00:00:00.000Z`);
    const end = new Date(`${range.to}T00:00:00.000Z`);
    const days =
      Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    expect(days).toBe(30);
  });

  it("returns month-to-date for this_month", () => {
    const range = rangeForAnalyticsPeriod("this_month");
    expect(matchAnalyticsPeriodPreset(range)).toBe("this_month");
    expect(range.from.endsWith("-01") || range.from.slice(8) === "01").toBe(
      true,
    );
  });
});
