import "server-only";

import { getEnv } from "@/config/env";

export type FastshiftConfig = {
  registerUrl: string;
  statusUrlBase: string;
  token: string;
  appUrl: string;
  testMode: boolean;
};

const DEFAULT_REGISTER_URL =
  "https://merchants.fastshift.am/api/en/vpos/order/register";
const DEFAULT_STATUS_BASE =
  "https://merchants.fastshift.am/api/en/vpos/order/status";

/** Returns FastShift credentials when configured; otherwise null. */
export function getFastshiftConfig(): FastshiftConfig | null {
  const env = getEnv();
  const testMode = env.FASTSHIFT_TEST_MODE !== false;
  const token = testMode ? env.FASTSHIFT_TOKEN : env.FASTSHIFT_LIVE_TOKEN;

  if (!token) {
    return null;
  }

  return {
    registerUrl: env.FASTSHIFT_REGISTER_URL ?? DEFAULT_REGISTER_URL,
    statusUrlBase: env.FASTSHIFT_STATUS_URL_BASE ?? DEFAULT_STATUS_BASE,
    token,
    appUrl: env.NEXT_PUBLIC_APP_URL.replace(/\/$/, ""),
    testMode,
  };
}
