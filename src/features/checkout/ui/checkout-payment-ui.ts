export const CHECKOUT_PAYMENT_ICON_BOX_HEIGHT_PX = 40;
export const CHECKOUT_PAYMENT_ICON_BOX_RADIUS_PX = 8;
export const CHECKOUT_PAYMENT_CARD_BADGES_GAP_PX = 8;

export const CHECKOUT_PAYMENT_WALLET_BOX_WIDTH_PX = 112;
export const CHECKOUT_PAYMENT_WALLET_BOX_WIDTH_MOBILE_PX = 96;
export const CHECKOUT_PAYMENT_WALLET_LOGO_HEIGHT_PX = 32;
export const CHECKOUT_PAYMENT_WALLET_LOGO_HEIGHT_MOBILE_PX = 26;

export const CHECKOUT_PAYMENT_CARD_BADGE_PADDING_PX = 8;
export const CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_PX =
  CHECKOUT_PAYMENT_ICON_BOX_HEIGHT_PX;
export const CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_PX =
  CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_PX -
  CHECKOUT_PAYMENT_CARD_BADGE_PADDING_PX * 2;

export const CHECKOUT_PAYMENT_CARD_BADGE_PADDING_MOBILE_PX = 4;
export const CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_MOBILE_PX = 30;
export const CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_MOBILE_PX =
  CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_MOBILE_PX -
  CHECKOUT_PAYMENT_CARD_BADGE_PADDING_MOBILE_PX * 2;
export const CHECKOUT_PAYMENT_CARD_BADGE_RADIUS_MOBILE_PX = 5;
export const CHECKOUT_PAYMENT_CARD_BADGES_GAP_MOBILE_PX = 4;

export const CHECKOUT_PAYMENT_CARD_BADGE_ORDER = [
  "Visa",
  "Mastercard",
  "ArCa",
] as const;

export type CheckoutCardBadgeAlt =
  (typeof CHECKOUT_PAYMENT_CARD_BADGE_ORDER)[number];

export type CheckoutCardPaymentBadge = {
  alt: CheckoutCardBadgeAlt;
  src: string;
  sourceWidthPx: number;
  sourceHeightPx: number;
  innerLogoScale?: number;
};

export type CheckoutCardBadgeFramedBoxSize = {
  widthPx: number;
  heightPx: number;
};

export const CHECKOUT_PAYMENT_WALLET_LOGO_SRC =
  "/assets/payments/checkout/fastshift.webp";
export const CHECKOUT_PAYMENT_WALLET_LOGO_SOURCE_WIDTH_PX = 1024;
export const CHECKOUT_PAYMENT_WALLET_LOGO_SOURCE_HEIGHT_PX = 270;

export const CHECKOUT_CARD_PAYMENT_BADGES: CheckoutCardPaymentBadge[] = [
  {
    alt: "Visa",
    src: "/assets/payments/checkout/visa.webp",
    sourceWidthPx: 877,
    sourceHeightPx: 284,
    innerLogoScale: 0.9,
  },
  {
    alt: "Mastercard",
    src: "/assets/payments/checkout/mastercard.webp",
    sourceWidthPx: 567,
    sourceHeightPx: 440,
    innerLogoScale: 1.25,
  },
  {
    alt: "ArCa",
    src: "/assets/payments/checkout/arca.webp",
    sourceWidthPx: 1024,
    sourceHeightPx: 1024,
    innerLogoScale: 3.5,
  },
];

/** Uniform framed box — sized from Visa wordmark width at the given logo height. */
export function getCheckoutCardBadgeFramedBoxSize(
  logoHeightPx: number,
  paddingPx: number,
  boxHeightPx?: number,
): CheckoutCardBadgeFramedBoxSize {
  const visaBadge = CHECKOUT_CARD_PAYMENT_BADGES.find(
    (badge) => badge.alt === "Visa",
  );
  const heightPx = boxHeightPx ?? logoHeightPx + paddingPx * 2;

  if (!visaBadge) {
    return {
      widthPx: logoHeightPx + paddingPx * 2,
      heightPx,
    };
  }

  const visaLogoWidthPx = Math.round(
    visaBadge.sourceWidthPx * (logoHeightPx / visaBadge.sourceHeightPx),
  );

  return {
    widthPx: visaLogoWidthPx + paddingPx * 2,
    heightPx,
  };
}
