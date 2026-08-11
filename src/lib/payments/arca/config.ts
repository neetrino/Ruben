import "server-only";

import { getEnv } from "@/config/env";

export type ArcaConfig = {
  baseUrl: string;
  userName: string;
  password: string;
  appUrl: string;
  testMode: boolean;
};

const BASE_URLS = {
  idbank: {
    test: "https://ipaytest.arca.am:8445/payment/rest",
    live: "https://ipay.arca.am/payment/rest",
  },
  inecobank: {
    test: "https://pg.inecoecom.am/payment/rest",
    live: "https://pg.inecoecom.am/payment/rest",
  },
} as const;

type ArcaBank = keyof typeof BASE_URLS;

function resolveBank(value: string | undefined): ArcaBank {
  if (value === "inecobank") {
    return "inecobank";
  }
  return "idbank";
}

/** Returns ArCa credentials when configured; otherwise null. */
export function getArcaConfig(): ArcaConfig | null {
  const env = getEnv();
  const testMode = env.ARCA_TEST_MODE !== false;
  const userName = testMode ? env.ARCA_USERNAME : env.ARCA_LIVE_USERNAME;
  const password = testMode ? env.ARCA_PASSWORD : env.ARCA_LIVE_PASSWORD;

  if (!userName || !password) {
    return null;
  }

  const bank = resolveBank(env.ARCA_BANK);
  const urls = BASE_URLS[bank];

  return {
    baseUrl: testMode ? urls.test : urls.live,
    userName,
    password,
    appUrl: env.NEXT_PUBLIC_APP_URL.replace(/\/$/, ""),
    testMode,
  };
}
