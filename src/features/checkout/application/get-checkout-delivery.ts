import "server-only";

import {
  listCheckoutDeliveryOptions,
  type CheckoutDeliveryOption,
} from "@/features/delivery/application/queries";
import type { Locale } from "@/lib/i18n/config";

export type { CheckoutDeliveryOption };

/** Active delivery locations for the checkout dropdown. */
export async function getCheckoutDeliveryOptions(
  locale: Locale,
): Promise<CheckoutDeliveryOption[]> {
  return listCheckoutDeliveryOptions(locale);
}
