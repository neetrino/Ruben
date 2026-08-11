import { handleArcaCallback } from "@/features/payments/application/handle-arca-callback";

export async function GET(request: Request): Promise<Response> {
  return handleArcaCallback(request);
}
