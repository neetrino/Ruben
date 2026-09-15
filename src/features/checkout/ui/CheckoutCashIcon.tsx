import Image from "next/image";

import { CHECKOUT_PAYMENT_CASH_ICON_SRC } from "@/features/checkout/ui/checkout-payment-ui";

type CheckoutCashIconProps = {
  sizePx?: number;
  className?: string;
};

/** Cash payment icon — hand holding banknotes. */
export function CheckoutCashIcon({
  sizePx = 36,
  className = "",
}: CheckoutCashIconProps) {
  return (
    <Image
      src={CHECKOUT_PAYMENT_CASH_ICON_SRC}
      alt=""
      width={256}
      height={256}
      className={`shrink-0 object-contain ${className}`.trim()}
      style={{ width: sizePx, height: sizePx }}
      aria-hidden
      unoptimized
    />
  );
}
