import { describe, expect, it } from "vitest";

import {
  isArcaPaymentCaptured,
  isArcaPaymentFailed,
  toArcaAmountMinorUnits,
} from "@/lib/payments/arca/types";
import {
  isFastshiftFailureStatus,
  isFastshiftOrderGuid,
  isFastshiftSuccessStatus,
} from "@/lib/payments/fastshift/types";
import {
  isOnlineCheckoutPaymentMethod,
  toPaymentRecord,
} from "@/features/checkout/domain/payment-methods";

describe("checkout payment methods", () => {
  it("maps card to ArCa and cash to COD", () => {
    expect(toPaymentRecord("card")).toEqual({
      provider: "arca",
      method: "CARD",
    });
    expect(toPaymentRecord("cash_on_delivery")).toEqual({
      provider: "cod",
      method: "COD",
    });
    expect(toPaymentRecord("fastshift")).toEqual({
      provider: "fastshift",
      method: "FASTSHIFT",
    });
  });

  it("marks card and FastShift as online", () => {
    expect(isOnlineCheckoutPaymentMethod("card")).toBe(true);
    expect(isOnlineCheckoutPaymentMethod("fastshift")).toBe(true);
    expect(isOnlineCheckoutPaymentMethod("cash_on_delivery")).toBe(false);
  });
});

describe("arca amount and status helpers", () => {
  it("converts AMD major units to ArCa minor units", () => {
    expect(toArcaAmountMinorUnits(1000, "AMD")).toBe(100000);
    expect(toArcaAmountMinorUnits(10.5, "USD")).toBe(1050);
  });

  it("detects deposited and declined states", () => {
    expect(
      isArcaPaymentCaptured({
        orderStatus: 2,
        paymentAmountInfo: { paymentState: "DEPOSITED" },
      }),
    ).toBe(true);
    expect(
      isArcaPaymentFailed({
        orderStatus: 3,
        paymentAmountInfo: { paymentState: "DECLINED" },
      }),
    ).toBe(true);
  });
});

describe("fastshift helpers", () => {
  it("validates guids and success/failure statuses", () => {
    expect(
      isFastshiftOrderGuid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
    ).toBe(true);
    expect(isFastshiftOrderGuid("not-a-guid")).toBe(false);
    expect(isFastshiftSuccessStatus("completed")).toBe(true);
    expect(isFastshiftFailureStatus("rejected")).toBe(true);
  });
});
