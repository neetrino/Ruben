import type { ReactNode } from "react";
import Image from "next/image";

import { HOME_ASSETS } from "@/features/home/config/assets";

type AuthPageShellProps = {
  brandLabel: string;
  title: string;
  subtitle: string;
  /** Wider panel for multi-field forms (register). */
  wide?: boolean;
  children: ReactNode;
};

/**
 * Storefront auth layout — checkout-aligned panel with home yellow wave lines.
 */
export function AuthPageShell({
  brandLabel,
  title,
  subtitle,
  wide = false,
  children,
}: AuthPageShellProps) {
  const panelWidthClass = wide ? "max-w-lg" : "max-w-md";

  return (
    <div className="auth-page-root relative z-0 -mx-4 -my-10 bg-white sm:-mx-6 lg:-mx-8">
      <div className="relative z-10 mx-auto flex min-h-[min(70vh,720px)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className={`auth-page-panel w-full ${panelWidthClass}`}>
          <div className="overflow-hidden rounded-[20px] border border-gray-200/80 bg-white shadow-[0_18px_50px_-28px_rgba(17,24,39,0.35)]">
            <div className="h-1.5 w-full bg-[var(--brand)]" />
            <div className="px-6 py-8 sm:px-8 sm:py-10">
              <div className="mb-8 space-y-2 text-center sm:mb-10">
                <p className="text-xs font-semibold tracking-[0.18em] text-[var(--brand-deep)] uppercase">
                  {brandLabel}
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {title}
                </h1>
                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                  {subtitle}
                </p>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Same yellow stroke as home hero — behind form & footer. */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden md:block"
        aria-hidden
      >
        <Image
          src={HOME_ASSETS.heroWave}
          alt=""
          width={1370}
          height={1380}
          priority
          className="absolute top-[-200px] right-[-280px] h-auto w-[1100px] max-w-none select-none lg:right-[-160px] lg:w-[1280px]"
        />
      </div>
    </div>
  );
}
