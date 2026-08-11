import "server-only";

import { desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { orders, payments } from "@/db/schema";
import { getArcaConfig } from "@/lib/payments/arca/config";
import { registerArcaOrder } from "@/lib/payments/arca/client";
import { createId } from "@/lib/id";
import { logger } from "@/lib/observability/logger";

/**
 * Registers the order with ArCa and returns the bank payment form URL.
 */
export async function startArcaPayment(orderNumber: string): Promise<string> {
  const config = getArcaConfig();
  if (!config) {
    throw new Error("Card payment is not configured.");
  }

  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.paymentStatus === "CAPTURED") {
    throw new Error("Order is already paid.");
  }

  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.orderId, order.id))
    .orderBy(desc(payments.attemptNumber))
    .limit(1);

  if (!payment || payment.provider !== "arca") {
    throw new Error("Order is not a card payment.");
  }

  const returnUrl = `${config.appUrl}/api/v1/payments/arca/callback?order=${encodeURIComponent(order.orderNumber)}`;
  const registered = await registerArcaOrder(config, {
    orderNumber: order.orderNumber,
    amountMajor: order.totalAmount,
    currency: order.baseCurrency,
    returnUrl,
    description: `Order ${order.orderNumber}`,
    language: order.locale === "hy" ? "hy" : order.locale === "ru" ? "ru" : "en",
  });

  await db
    .update(payments)
    .set({
      providerReference: registered.orderId,
      metadata: {
        ...(payment.metadata ?? {}),
        arcaOrderId: registered.orderId,
        initAttemptId: createId(),
      },
      updatedAt: new Date(),
    })
    .where(eq(payments.id, payment.id));

  logger.info("arca.payment_started", { orderNumber: order.orderNumber });
  return registered.formUrl;
}
