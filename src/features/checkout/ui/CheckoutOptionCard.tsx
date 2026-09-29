"use client";

import { m } from "motion/react";
import type { LabelHTMLAttributes, ReactNode } from "react";

const HIGHLIGHT_TRANSITION = {
  type: "spring" as const,
  stiffness: 420,
  damping: 36,
  mass: 0.7,
};

type CheckoutOptionCardProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "children"
> & {
  selected: boolean;
  /** Shared across options in one group so the highlight slides between them. */
  layoutId: string;
  children: ReactNode;
};

/**
 * Checkout radio option with a shared sliding selection highlight (layout animation).
 */
export function CheckoutOptionCard({
  selected,
  layoutId,
  children,
  className = "",
  ...rest
}: CheckoutOptionCardProps) {
  return (
    <label
      {...rest}
      className={`group relative z-0 flex cursor-pointer items-center rounded-[15px] border-2 border-transparent p-4 ${className}`.trim()}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-20 rounded-[15px] border-2 border-gray-200 bg-white transition-[opacity,background-color] duration-200 ${
          selected
            ? "opacity-0"
            : "opacity-100 group-hover:bg-gray-50/80"
        }`}
      />
      {selected ? (
        <m.span
          layoutId={layoutId}
          aria-hidden
          className="absolute inset-0 -z-10 rounded-[15px] border-2 border-[var(--brand)] bg-[color-mix(in_srgb,var(--brand)_14%,white)] shadow-[0_8px_24px_-16px_color-mix(in_srgb,var(--brand)_55%,transparent)]"
          transition={HIGHLIGHT_TRANSITION}
        />
      ) : null}
      {children}
    </label>
  );
}
