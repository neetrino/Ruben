export type FastshiftOrderStatus =
  | "pending"
  | "completed"
  | "rejected"
  | "expired"
  | string;

export type FastshiftOrderPayload = {
  order_number?: string;
  order_guid?: string;
  amount?: number;
  description?: string;
  status?: FastshiftOrderStatus;
  external_order_id?: string;
};

export type FastshiftRegisterResponse = {
  status?: string;
  message?: string;
  data?: {
    redirect_url?: string;
    order?: FastshiftOrderPayload;
  };
  redirect_url?: string;
};

export type FastshiftStatusResponse = {
  status?: string;
  message?: string;
  data?: {
    order?: FastshiftOrderPayload;
  };
};

const SUCCESS_STATUSES = new Set([
  "completed",
  "success",
  "paid",
  "COMPLETED",
  "SUCCESS",
  "PAID",
]);

const FAILURE_STATUSES = new Set([
  "rejected",
  "expired",
  "failed",
  "REJECTED",
  "EXPIRED",
  "FAILED",
]);

export function isFastshiftSuccessStatus(status: string | undefined): boolean {
  if (!status) return false;
  return SUCCESS_STATUSES.has(status) || SUCCESS_STATUSES.has(status.toLowerCase());
}

export function isFastshiftFailureStatus(status: string | undefined): boolean {
  if (!status) return false;
  return FAILURE_STATUSES.has(status) || FAILURE_STATUSES.has(status.toLowerCase());
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isFastshiftOrderGuid(value: string): boolean {
  return UUID_RE.test(value);
}
