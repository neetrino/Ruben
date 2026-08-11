import { handleFastshiftCallback } from "@/features/payments/application/handle-fastshift-callback";

export async function GET(request: Request): Promise<Response> {
  return handleFastshiftCallback(request);
}

export async function POST(request: Request): Promise<Response> {
  return handleFastshiftCallback(request);
}
