export const CHECKOUT_PAYMENT_METHODS = [
  "cash_on_delivery",
  "card",
  "fastshift",
] as const;

export type CheckoutPaymentMethod = (typeof CHECKOUT_PAYMENT_METHODS)[number];

export function isCheckoutPaymentMethod(
  value: string,
): value is CheckoutPaymentMethod {
  return (CHECKOUT_PAYMENT_METHODS as readonly string[]).includes(value);
}

/** Online providers that redirect away from checkout before capture. */
export function isOnlineCheckoutPaymentMethod(
  method: CheckoutPaymentMethod,
): boolean {
  return method === "card" || method === "fastshift";
}

/** Maps checkout UI payment choice to payments.provider / payments.method. */
export function toPaymentRecord(method: CheckoutPaymentMethod): {
  provider: string;
  method: string;
} {
  switch (method) {
    case "card":
      return { provider: "arca", method: "CARD" };
    case "fastshift":
      return { provider: "fastshift", method: "FASTSHIFT" };
    case "cash_on_delivery":
      return { provider: "cod", method: "COD" };
  }
}
