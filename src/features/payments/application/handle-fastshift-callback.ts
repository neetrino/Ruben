import "server-only";

import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db/client";
import { orders, payments } from "@/db/schema";
import { settleOnlinePayment } from "@/features/payments/application/settle-online-payment";
import { getFastshiftConfig } from "@/lib/payments/fastshift/config";
import { getFastshiftOrderStatus } from "@/lib/payments/fastshift/client";
import {
  isFastshiftFailureStatus,
  isFastshiftOrderGuid,
  isFastshiftSuccessStatus,
} from "@/lib/payments/fastshift/types";
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

type CallbackParams = {
  order?: string | null;
  order_number?: string | null;
  status?: string | null;
};

async function parseParams(request: Request): Promise<CallbackParams> {
  const url = new URL(request.url);
  const fromQuery: CallbackParams = {
    order: url.searchParams.get("order"),
    order_number: url.searchParams.get("order_number"),
    status: url.searchParams.get("status"),
  };

  if (request.method === "GET") {
    return fromQuery;
  }

  const contentType = request.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as Record<string, unknown>;
      return {
        order:
          typeof body.order === "string" ? body.order : fromQuery.order,
        order_number:
          typeof body.order_number === "string"
            ? body.order_number
            : fromQuery.order_number,
        status:
          typeof body.status === "string" ? body.status : fromQuery.status,
      };
    }

    const form = await request.formData();
    return {
      order: String(form.get("order") ?? fromQuery.order ?? "") || null,
      order_number:
        String(form.get("order_number") ?? fromQuery.order_number ?? "") ||
        null,
      status: String(form.get("status") ?? fromQuery.status ?? "") || null,
    };
  } catch {
    return fromQuery;
  }
}

/**
 * FastShift GET redirect + POST webhook handler.
 * Status is verified via FastShift status API when possible.
 */
export async function handleFastshiftCallback(
  request: Request,
): Promise<Response> {
  const params = await parseParams(request);
  const isGet = request.method === "GET";
  const db = getDb();

  try {
    let order =
      params.order != null
        ? (
            await db
              .select()
              .from(orders)
              .where(eq(orders.orderNumber, params.order))
              .limit(1)
          )[0]
        : undefined;

    const guid =
      params.order_number && isFastshiftOrderGuid(params.order_number)
        ? params.order_number
        : null;

    if (!order && guid) {
      const [payment] = await db
        .select()
        .from(payments)
        .where(eq(payments.providerReference, guid))
        .orderBy(desc(payments.attemptNumber))
        .limit(1);
      if (payment) {
        order = (
          await db
            .select()
            .from(orders)
            .where(eq(orders.id, payment.orderId))
            .limit(1)
        )[0];
      }
    }

    if (!order) {
      if (isGet) {
        return checkoutRedirect("en", params.order ?? "unknown", false);
      }
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, order.id))
      .orderBy(desc(payments.attemptNumber))
      .limit(1);

    const providerGuid =
      guid ??
      payment?.providerReference ??
      (typeof payment?.metadata?.fastshiftOrderGuid === "string"
        ? payment.metadata.fastshiftOrderGuid
        : null);

    let status = params.status ?? undefined;
    const config = getFastshiftConfig();
    if (config && providerGuid && isFastshiftOrderGuid(providerGuid)) {
      try {
        const remote = await getFastshiftOrderStatus(config, providerGuid);
        status = remote.data?.order?.status ?? status;
      } catch (error) {
        logger.warn("fastshift.status_lookup_failed", {
          orderNumber: order.orderNumber,
          message: error instanceof Error ? error.message : "unknown",
        });
      }
    }

    if (isFastshiftSuccessStatus(status)) {
      await settleOnlinePayment({
        orderId: order.id,
        providerReference: providerGuid,
        providerEventId: `fastshift:${providerGuid ?? order.orderNumber}:completed`,
        outcome: "captured",
        rawSafePayload: { status },
      });
      if (isGet) {
        return checkoutRedirect(order.locale, order.orderNumber, true);
      }
      return NextResponse.json({ ok: true });
    }

    if (isFastshiftFailureStatus(status)) {
      await settleOnlinePayment({
        orderId: order.id,
        providerReference: providerGuid,
        providerEventId: `fastshift:${providerGuid ?? order.orderNumber}:failed`,
        outcome: "failed",
        rawSafePayload: { status },
      });
    }

    if (isGet) {
      return checkoutRedirect(order.locale, order.orderNumber, false);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("fastshift.callback_failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    if (isGet) {
      return checkoutRedirect("en", params.order ?? "unknown", false);
    }
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
