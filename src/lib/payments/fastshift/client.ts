import "server-only";

import type { FastshiftConfig } from "@/lib/payments/fastshift/config";
import type {
  FastshiftRegisterResponse,
  FastshiftStatusResponse,
} from "@/lib/payments/fastshift/types";
import { logger } from "@/lib/observability/logger";

export type RegisterFastshiftOrderInput = {
  orderGuid: string;
  amount: number;
  description: string;
  callbackUrl: string;
  webhookUrl: string;
  externalOrderId: string;
};

/** Registers a FastShift vPOS order and returns the payer redirect URL. */
export async function registerFastshiftOrder(
  config: FastshiftConfig,
  input: RegisterFastshiftOrderInput,
): Promise<{ redirectUrl: string; providerOrderNumber: string }> {
  const response = await fetch(config.registerUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      order_number: input.orderGuid,
      amount: Math.round(input.amount),
      description: input.description,
      callback_url: input.callbackUrl,
      webhook_url: input.webhookUrl,
      external_order_id: input.externalOrderId,
    }),
    cache: "no-store",
  });

  const raw = (await response.json()) as FastshiftRegisterResponse;
  const redirectUrl = raw.data?.redirect_url ?? raw.redirect_url;
  const providerOrderNumber =
    raw.data?.order?.order_number ?? input.orderGuid;

  if (!response.ok || !redirectUrl) {
    logger.error("fastshift.register_failed", {
      httpStatus: response.status,
      apiStatus: raw.status,
    });
    throw new Error(raw.message || "Unable to start FastShift payment.");
  }

  return { redirectUrl, providerOrderNumber };
}

/** Fetches authoritative FastShift order status by register GUID. */
export async function getFastshiftOrderStatus(
  config: FastshiftConfig,
  orderGuid: string,
): Promise<FastshiftStatusResponse> {
  const response = await fetch(`${config.statusUrlBase}/${orderGuid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return (await response.json()) as FastshiftStatusResponse;
}
