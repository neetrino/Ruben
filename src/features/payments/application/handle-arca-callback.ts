import "server-only";

import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db/client";
import { orders, payments } from "@/db/schema";
import { settleOnlinePayment } from "@/features/payments/application/settle-online-payment";
import { getArcaConfig } from "@/lib/payments/arca/config";
import { getArcaOrderStatus } from "@/lib/payments/arca/client";
import {
  isArcaPaymentCaptured,
  isArcaPaymentFailed,
} from "@/lib/payments/arca/types";
import { logger } from "@/lib/observability/logger";

function checkoutRedirect(
  locale: string,
  orderNumber: string,
  success: boolean,
): NextResponse {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
  const path = success
    ? `/${locale}/checkout/success/${orderNumber}`
    : `/${locale}/checkout`;
  return NextResponse.redirect(`${appUrl}${path}`);
}

/** ArCa browser return — verifies status via getOrderStatusExtended.do. */
export async function handleArcaCallback(
  request: Request,
): Promise<NextResponse> {
  const url = new URL(request.url);
  const orderNumberParam = url.searchParams.get("order");
  const arcaOrderIdParam =
    url.searchParams.get("orderId") ?? url.searchParams.get("mdOrder");

  const config = getArcaConfig();
  if (!config) {
    logger.error("arca.callback_unconfigured", {});
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/en/checkout`,
    );
  }

  const db = getDb();

  try {
    let order =
      orderNumberParam != null
        ? (
            await db
              .select()
              .from(orders)
              .where(eq(orders.orderNumber, orderNumberParam))
              .limit(1)
          )[0]
        : undefined;

    const [paymentByRef] =
      !order && arcaOrderIdParam
        ? await db
            .select()
            .from(payments)
            .where(eq(payments.providerReference, arcaOrderIdParam))
            .orderBy(desc(payments.attemptNumber))
            .limit(1)
        : [];

    if (!order && paymentByRef) {
      order = (
        await db
          .select()
          .from(orders)
          .where(eq(orders.id, paymentByRef.orderId))
          .limit(1)
      )[0];
    }

    if (!order) {
      return checkoutRedirect("en", orderNumberParam ?? "unknown", false);
    }

    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, order.id))
      .orderBy(desc(payments.attemptNumber))
      .limit(1);

    const arcaOrderId =
      arcaOrderIdParam ??
      payment?.providerReference ??
      (typeof payment?.metadata?.arcaOrderId === "string"
        ? payment.metadata.arcaOrderId
        : null);

    if (!arcaOrderId) {
      return checkoutRedirect(order.locale, order.orderNumber, false);
    }

    const status = await getArcaOrderStatus(config, arcaOrderId);

    if (isArcaPaymentCaptured(status)) {
      await settleOnlinePayment({
        orderId: order.id,
        providerReference: arcaOrderId,
        providerEventId: `arca:${arcaOrderId}:deposited`,
        outcome: "captured",
        rawSafePayload: {
          orderStatus: status.orderStatus,
          paymentState: status.paymentAmountInfo?.paymentState,
        },
      });
      return checkoutRedirect(order.locale, order.orderNumber, true);
    }

    if (isArcaPaymentFailed(status)) {
      await settleOnlinePayment({
        orderId: order.id,
        providerReference: arcaOrderId,
        providerEventId: `arca:${arcaOrderId}:failed`,
        outcome: "failed",
        rawSafePayload: {
          orderStatus: status.orderStatus,
          paymentState: status.paymentAmountInfo?.paymentState,
        },
      });
    }

    return checkoutRedirect(order.locale, order.orderNumber, false);
  } catch (error) {
    logger.error("arca.callback_failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return checkoutRedirect(
      "en",
      orderNumberParam ?? "unknown",
      false,
    );
  }
}
