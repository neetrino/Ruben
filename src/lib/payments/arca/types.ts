/** ArCa register.do success payload (subset). */
export type ArcaRegisterResponse = {
  errorCode?: string | number;
  errorMessage?: string;
  orderId?: string;
  formUrl?: string;
};

/** ArCa getOrderStatusExtended.do payload (subset). */
export type ArcaOrderStatusResponse = {
  errorCode?: string | number;
  errorMessage?: string;
  orderNumber?: string;
  orderStatus?: number;
  actionCode?: number;
  paymentAmountInfo?: {
    paymentState?: string;
    approvedAmount?: number;
    depositedAmount?: number;
  };
};

export const ARCA_CURRENCY_NUMERIC: Record<string, string> = {
  AMD: "051",
  USD: "840",
  EUR: "978",
  RUB: "643",
};

/** AMD is stored in whole dram; ArCa expects minor units (×100). */
export function toArcaAmountMinorUnits(
  amountMajor: number,
  currency: string,
): number {
  if (currency.toUpperCase() === "AMD") {
    return Math.round(amountMajor) * 100;
  }
  return Math.round(amountMajor * 100);
}

export function isArcaPaymentCaptured(
  status: ArcaOrderStatusResponse,
): boolean {
  const state = status.paymentAmountInfo?.paymentState?.toUpperCase();
  if (state === "DEPOSITED") {
    return true;
  }
  return status.orderStatus === 2;
}

export function isArcaPaymentFailed(status: ArcaOrderStatusResponse): boolean {
  const state = status.paymentAmountInfo?.paymentState?.toUpperCase();
  if (state === "DECLINED" || state === "REVERSED") {
    return true;
  }
  return status.orderStatus === 3 || status.orderStatus === 4;
}
