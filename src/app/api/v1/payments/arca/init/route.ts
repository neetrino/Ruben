import { NextResponse } from "next/server";
import { z } from "zod";

import { startArcaPayment } from "@/features/payments/application/start-arca-payment";
import { logger } from "@/lib/observability/logger";

const bodySchema = z.object({
  orderNumber: z.string().min(1).max(64),
});

/** Starts ArCa card payment and returns bank form redirect URL. */
export async function POST(request: Request): Promise<Response> {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const redirectUrl = await startArcaPayment(parsed.data.orderNumber);
    return NextResponse.json({ redirectUrl });
  } catch (error) {
    logger.error("arca.init_failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to start card payment.",
      },
      { status: 400 },
    );
  }
}
