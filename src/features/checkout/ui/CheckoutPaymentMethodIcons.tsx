"use client";

import Image from "next/image";

import { CheckoutCashIcon } from "@/features/checkout/ui/CheckoutCashIcon";
import { CheckoutPaymentBadge } from "@/features/checkout/ui/CheckoutPaymentBadge";
import {
  CHECKOUT_CARD_PAYMENT_BADGES,
  CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_MOBILE_PX,
  CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_PX,
  CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_MOBILE_PX,
  CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_PX,
  CHECKOUT_PAYMENT_CARD_BADGE_PADDING_MOBILE_PX,
  CHECKOUT_PAYMENT_CARD_BADGE_PADDING_PX,
  CHECKOUT_PAYMENT_CARD_BADGE_RADIUS_MOBILE_PX,
  CHECKOUT_PAYMENT_CARD_BADGES_GAP_MOBILE_PX,
  CHECKOUT_PAYMENT_CARD_BADGES_GAP_PX,
  CHECKOUT_PAYMENT_CARD_BADGE_ORDER,
  CHECKOUT_PAYMENT_ICON_BOX_HEIGHT_PX,
  CHECKOUT_PAYMENT_ICON_BOX_RADIUS_PX,
  CHECKOUT_PAYMENT_WALLET_BOX_WIDTH_MOBILE_PX,
  CHECKOUT_PAYMENT_WALLET_BOX_WIDTH_PX,
  CHECKOUT_PAYMENT_WALLET_LOGO_HEIGHT_MOBILE_PX,
  CHECKOUT_PAYMENT_WALLET_LOGO_HEIGHT_PX,
  CHECKOUT_PAYMENT_WALLET_LOGO_SOURCE_HEIGHT_PX,
  CHECKOUT_PAYMENT_WALLET_LOGO_SOURCE_WIDTH_PX,
  getCheckoutCardBadgeFramedBoxSize,
} from "@/features/checkout/ui/checkout-payment-ui";

const CASH_ICON_SIZE_MOBILE_PX = 48;
const CASH_ICON_SIZE_DESKTOP_PX = 44;

function getCheckoutCardBadges() {
  return CHECKOUT_PAYMENT_CARD_BADGE_ORDER.map((alt) =>
    CHECKOUT_CARD_PAYMENT_BADGES.find((badge) => badge.alt === alt),
  ).filter(
    (badge): badge is (typeof CHECKOUT_CARD_PAYMENT_BADGES)[number] =>
      badge !== undefined,
  );
}

type WalletLogoBoxProps = {
  logoSrc: string;
  alt: string;
  mobile: boolean;
  logoError: boolean;
  onLogoError: () => void;
};

function WalletLogoBox({
  logoSrc,
  alt,
  mobile,
  logoError,
  onLogoError,
}: WalletLogoBoxProps) {
  const widthPx = mobile
    ? CHECKOUT_PAYMENT_WALLET_BOX_WIDTH_MOBILE_PX
    : CHECKOUT_PAYMENT_WALLET_BOX_WIDTH_PX;
  const logoHeightPx = mobile
    ? CHECKOUT_PAYMENT_WALLET_LOGO_HEIGHT_MOBILE_PX
    : CHECKOUT_PAYMENT_WALLET_LOGO_HEIGHT_PX;

  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden border border-gray-200 bg-white px-1.5"
      style={{
        width: widthPx,
        height: CHECKOUT_PAYMENT_ICON_BOX_HEIGHT_PX,
        borderRadius: CHECKOUT_PAYMENT_ICON_BOX_RADIUS_PX,
      }}
    >
      {logoError ? (
        <span className="text-xs font-semibold text-gray-500">{alt}</span>
      ) : (
        <Image
          src={logoSrc}
          alt={alt}
          width={CHECKOUT_PAYMENT_WALLET_LOGO_SOURCE_WIDTH_PX}
          height={CHECKOUT_PAYMENT_WALLET_LOGO_SOURCE_HEIGHT_PX}
          className="w-auto object-contain object-center"
          style={{ height: logoHeightPx }}
          unoptimized
          onError={onLogoError}
        />
      )}
    </div>
  );
}

export type CheckoutPaymentIconKind = "cash" | "wallet" | "card-badges";

type CheckoutPaymentMethodIconsProps = {
  kind: CheckoutPaymentIconKind;
  walletLogoSrc?: string;
  walletAlt?: string;
  walletLogoError?: boolean;
  onWalletLogoError?: () => void;
  mobileCardFramed?: boolean;
};

export function CheckoutPaymentMethodIcons({
  kind,
  walletLogoSrc,
  walletAlt = "Wallet",
  walletLogoError = false,
  onWalletLogoError,
  mobileCardFramed = false,
}: CheckoutPaymentMethodIconsProps) {
  if (kind === "cash") {
    return (
      <>
        <div className="flex shrink-0 items-center justify-center lg:hidden">
          <CheckoutCashIcon
            sizePx={CASH_ICON_SIZE_MOBILE_PX}
            className="text-black"
          />
        </div>
        <div className="hidden shrink-0 items-center justify-center lg:flex">
          <CheckoutCashIcon
            sizePx={CASH_ICON_SIZE_DESKTOP_PX}
            className="text-black"
          />
        </div>
      </>
    );
  }

  if (kind === "wallet" && walletLogoSrc) {
    return (
      <>
        <div className="lg:hidden">
          <WalletLogoBox
            logoSrc={walletLogoSrc}
            alt={walletAlt}
            mobile
            logoError={walletLogoError}
            onLogoError={() => onWalletLogoError?.()}
          />
        </div>
        <div className="hidden lg:block">
          <WalletLogoBox
            logoSrc={walletLogoSrc}
            alt={walletAlt}
            mobile={false}
            logoError={walletLogoError}
            onLogoError={() => onWalletLogoError?.()}
          />
        </div>
      </>
    );
  }

  const mobileFramedBoxSize = getCheckoutCardBadgeFramedBoxSize(
    CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_MOBILE_PX,
    CHECKOUT_PAYMENT_CARD_BADGE_PADDING_MOBILE_PX,
    CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_MOBILE_PX,
  );
  const desktopFramedBoxSize = getCheckoutCardBadgeFramedBoxSize(
    CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_PX,
    CHECKOUT_PAYMENT_CARD_BADGE_PADDING_PX,
    CHECKOUT_PAYMENT_CARD_BADGE_BOX_HEIGHT_PX,
  );

  return (
    <>
      <div
        className="flex max-w-full flex-wrap items-center justify-start self-start lg:hidden"
        style={{ gap: CHECKOUT_PAYMENT_CARD_BADGES_GAP_MOBILE_PX }}
      >
        {getCheckoutCardBadges().map((badge) => (
          <CheckoutPaymentBadge
            key={badge.alt}
            badge={badge}
            logoHeightPx={CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_MOBILE_PX}
            radiusPx={CHECKOUT_PAYMENT_CARD_BADGE_RADIUS_MOBILE_PX}
            paddingPx={CHECKOUT_PAYMENT_CARD_BADGE_PADDING_MOBILE_PX}
            framed={mobileCardFramed}
            framedBoxSize={
              mobileCardFramed ? mobileFramedBoxSize : undefined
            }
          />
        ))}
      </div>

      <div
        className="hidden shrink-0 flex-nowrap items-center justify-start lg:flex"
        style={{ gap: CHECKOUT_PAYMENT_CARD_BADGES_GAP_PX }}
      >
        {getCheckoutCardBadges().map((badge) => (
          <CheckoutPaymentBadge
            key={badge.alt}
            badge={badge}
            logoHeightPx={CHECKOUT_PAYMENT_CARD_BADGE_LOGO_HEIGHT_PX}
            radiusPx={CHECKOUT_PAYMENT_ICON_BOX_RADIUS_PX}
            paddingPx={CHECKOUT_PAYMENT_CARD_BADGE_PADDING_PX}
            framed
            framedBoxSize={desktopFramedBoxSize}
          />
        ))}
      </div>
    </>
  );
}
