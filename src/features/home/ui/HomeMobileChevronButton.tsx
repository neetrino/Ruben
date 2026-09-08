import Image from "next/image";
import type { ButtonHTMLAttributes } from "react";

import { AppLink } from "@/components/ui/AppLink";
import { HOME_MOBILE_ASSETS } from "@/features/home/config/assets";

const BUTTON_CLASS =
  "inline-flex size-[42px] shrink-0 items-center justify-center rounded-[14px] bg-[#1f1f1f]";

type ChevronDirection = "left" | "right";

type HomeMobileChevronIconProps = {
  direction?: ChevronDirection;
};

/**
 * Figma 171:489 chevron — asset points left; flip for right (171:488).
 */
export function HomeMobileChevronIcon({
  direction = "right",
}: HomeMobileChevronIconProps) {
  return (
    <Image
      src={HOME_MOBILE_ASSETS.chevron}
      alt=""
      width={10}
      height={17}
      className={
        direction === "right"
          ? "h-[17px] w-[10px] -scale-y-100 rotate-180"
          : "h-[17px] w-[10px]"
      }
      aria-hidden
    />
  );
}

type HomeMobileChevronLinkProps = {
  href: string;
  label: string;
  direction?: ChevronDirection;
  className?: string;
};

/** Square black chevron control used as a link (section “view all”). */
export function HomeMobileChevronLink({
  href,
  label,
  direction = "right",
  className = "",
}: HomeMobileChevronLinkProps) {
  return (
    <AppLink
      href={href}
      prefetchPolicy="intent"
      aria-label={label}
      className={`${BUTTON_CLASS} ${className}`}
    >
      <HomeMobileChevronIcon direction={direction} />
    </AppLink>
  );
}

type HomeMobileChevronButtonProps = {
  label: string;
  direction?: ChevronDirection;
  className?: string;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type">;

/** Square black chevron control used as a button (carousel). */
export function HomeMobileChevronButton({
  label,
  direction = "right",
  className = "",
  type = "button",
  onClick,
}: HomeMobileChevronButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      onClick={onClick}
      className={`${BUTTON_CLASS} ${className}`}
    >
      <HomeMobileChevronIcon direction={direction} />
    </button>
  );
}
