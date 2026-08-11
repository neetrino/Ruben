import "server-only";

import { desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { orders, payments } from "@/db/schema";
import { getFastshiftConfig } from "@/lib/payments/fastshift/config";
import { registerFastshiftOrder } from "@/lib/payments/fastshift/client";
import { createId } from "@/lib/id";
import { logger } from "@/lib/observability/logger";

/**
 * Registers the order with FastShift and returns the wallet redirect URL.
 */
export async function startFastshiftPayment(
  orderNumber: string,
): Promise<string> {
  const config = getFastshiftConfig();
  if (!config) {
    throw new Error("FastShift payment is not configured.");
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

  if (order.baseCurrency.toUpperCase() !== "AMD") {
    throw new Error("FastShift supports AMD only.");
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

  if (!payment || payment.provider !== "fastshift") {
    throw new Error("Order is not a FastShift payment.");
  }

  const orderGuid = createId();
  const callbackUrl = `${config.appUrl}/api/v1/payments/fastshift/callback?order=${encodeURIComponent(order.orderNumber)}`;
  const registered = await registerFastshiftOrder(config, {
    orderGuid,
    amount: order.totalAmount,
    description: `Order ${order.orderNumber}`,
    callbackUrl,
    webhookUrl: callbackUrl,
    externalOrderId: order.id,
  });

  await db
    .update(payments)
    .set({
      providerReference: registered.providerOrderNumber,
      metadata: {
        ...(payment.metadata ?? {}),
        fastshiftOrderGuid: registered.providerOrderNumber,
        initAttemptId: createId(),
      },
      updatedAt: new Date(),
    })
    .where(eq(payments.id, payment.id));

  logger.info("fastshift.payment_started", { orderNumber: order.orderNumber });
  return registered.redirectUrl;
}
