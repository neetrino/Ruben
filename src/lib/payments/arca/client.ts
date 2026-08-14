import "server-only";

import type { ArcaConfig } from "@/lib/payments/arca/config";
import {
  ARCA_CURRENCY_NUMERIC,
  type ArcaOrderStatusResponse,
  type ArcaRegisterResponse,
  toArcaAmountMinorUnits,
} from "@/lib/payments/arca/types";
import { logger } from "@/lib/observability/logger";

async function postForm(
  config: ArcaConfig,
  path: string,
  fields: Record<string, string>,
): Promise<unknown> {
  const body = new URLSearchParams({
    userName: config.userName,
    password: config.password,
    ...fields,
  });

  const response = await fetch(`${config.baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const text = await response.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    logger.error("arca.invalid_json", {
      path,
      status: response.status,
    });
    throw new Error("ArCa returned an invalid response.");
  }
}

export type RegisterArcaOrderInput = {
  orderNumber: string;
  amountMajor: number;
  currency: string;
  returnUrl: string;
  description: string;
  language: string;
};

/** Registers an order with ArCa and returns bank form URL + provider order id. */
export async function registerArcaOrder(
  config: ArcaConfig,
  input: RegisterArcaOrderInput,
): Promise<{ orderId: string; formUrl: string }> {
  const currencyCode =
    ARCA_CURRENCY_NUMERIC[input.currency.toUpperCase()] ?? "051";

  const raw = (await postForm(config, "/register.do", {
    orderNumber: input.orderNumber,
    amount: String(toArcaAmountMinorUnits(input.amountMajor, input.currency)),
    currency: currencyCode,
    returnUrl: input.returnUrl,
    description: input.description,
    language: input.language,
    jsonParams: JSON.stringify({ FORCE_3DS2: "true" }),
  })) as ArcaRegisterResponse;

  const errorCode = String(raw.errorCode ?? "0");
  if (errorCode !== "0" || !raw.orderId || !raw.formUrl) {
    logger.error("arca.register_failed", {
      errorCode,
      hasOrderId: Boolean(raw.orderId),
    });
    throw new Error(raw.errorMessage || "Unable to start card payment.");
  }

  return { orderId: raw.orderId, formUrl: raw.formUrl };
}

/** Fetches authoritative payment status from ArCa (never trust return URL alone). */
export async function getArcaOrderStatus(
  config: ArcaConfig,
  arcaOrderId: string,
): Promise<ArcaOrderStatusResponse> {
  return (await postForm(config, "/getOrderStatusExtended.do", {
    orderId: arcaOrderId,
  })) as ArcaOrderStatusResponse;
}
