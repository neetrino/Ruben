import "server-only";

import { and, desc, eq } from "drizzle-orm";

import {
  cartItems,
  carts,
  orderEvents,
  orders,
  payments,
} from "@/db/schema";
import { withTransaction } from "@/db/transaction";
import { revalidateCartPaths } from "@/features/cart/cart";
import { createId } from "@/lib/id";
import { logger } from "@/lib/observability/logger";

export type OnlinePaymentOutcome = "captured" | "failed" | "pending";

type CaptureInput = {
  orderId: string;
  providerReference: string | null;
  providerEventId: string;
  outcome: Exclude<OnlinePaymentOutcome, "pending">;
  rawSafePayload?: Record<string, unknown>;
};

/**
 * Marks order/payment captured or failed idempotently.
 * Clears the originating cart only on capture.
 */
export async function settleOnlinePayment(
  input: CaptureInput,
): Promise<{ alreadyFinal: boolean; orderNumber: string; locale: string }> {
  const result = await withTransaction(async (tx) => {
    const [locked] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, input.orderId))
      .for("update")
      .limit(1);

    if (!locked) {
      throw new Error("ORDER_NOT_FOUND");
    }

    if (
      locked.paymentStatus === "CAPTURED" ||
      locked.paymentStatus === "FAILED" ||
      locked.paymentStatus === "CANCELLED" ||
      locked.paymentStatus === "REFUNDED"
    ) {
      return {
        alreadyFinal: true,
        orderNumber: locked.orderNumber,
        locale: locked.locale,
        cartId: null as string | null,
      };
    }

    const [latestPayment] = await tx
      .select()
      .from(payments)
      .where(eq(payments.orderId, locked.id))
      .orderBy(desc(payments.attemptNumber))
      .limit(1);

    const now = new Date();
    const nextPaymentStatus =
      input.outcome === "captured" ? "CAPTURED" : "FAILED";
    const nextOrderStatus =
      input.outcome === "captured" ? "CONFIRMED" : locked.status;

    await tx
      .update(orders)
      .set({
        paymentStatus: nextPaymentStatus,
        status: nextOrderStatus,
        updatedAt: now,
      })
      .where(eq(orders.id, locked.id));

    if (latestPayment) {
      await tx
        .update(payments)
        .set({
          status: nextPaymentStatus,
          providerReference:
            input.providerReference ?? latestPayment.providerReference,
          metadata: {
            ...(latestPayment.metadata ?? {}),
            lastProviderEventId: input.providerEventId,
            ...(input.rawSafePayload
              ? { lastCallback: input.rawSafePayload }
              : {}),
          },
          updatedAt: now,
        })
        .where(eq(payments.id, latestPayment.id));
    }

    await tx.insert(orderEvents).values({
      id: createId(),
      orderId: locked.id,
      eventType: "PAYMENT_PROVIDER",
      fromState: locked.paymentStatus,
      toState: nextPaymentStatus,
      isCustomerVisible: true,
      payload: {
        providerEventId: input.providerEventId,
        outcome: input.outcome,
      },
    });

    if (input.outcome === "captured" && nextOrderStatus !== locked.status) {
      await tx.insert(orderEvents).values({
        id: createId(),
        orderId: locked.id,
        eventType: "STATUS_CHANGE",
        fromState: locked.status,
        toState: nextOrderStatus,
        isCustomerVisible: true,
        payload: { source: "payment_capture" },
      });
    }

    const cartId =
      typeof latestPayment?.metadata?.cartId === "string"
        ? latestPayment.metadata.cartId
        : null;

    return {
      alreadyFinal: false,
      orderNumber: locked.orderNumber,
      locale: locked.locale,
      cartId,
    };
  });

  if (input.outcome === "captured" && result.cartId) {
    try {
      await withTransaction(async (tx) => {
        const now = new Date();
        await tx.delete(cartItems).where(eq(cartItems.cartId, result.cartId!));
        await tx
          .update(carts)
          .set({ status: "CONVERTED", updatedAt: now })
          .where(
            and(eq(carts.id, result.cartId!), eq(carts.status, "ACTIVE")),
          );
      });
      await revalidateCartPaths();
    } catch (error) {
      logger.error("payments.cart_clear_failed", {
        orderNumber: result.orderNumber,
        message: error instanceof Error ? error.message : "unknown",
      });
    }
  }

  return {
    alreadyFinal: result.alreadyFinal,
    orderNumber: result.orderNumber,
    locale: result.locale,
  };
}
