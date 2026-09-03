import type { ReactNode } from "react";

type AuthPageShellProps = {
  brandLabel: string;
  title: string;
  subtitle: string;
  /** Wider panel for multi-field forms (register). */
  wide?: boolean;
  children: ReactNode;
};

/**
 * Storefront auth layout — checkout-aligned panel on a clean white ground.
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
    <div className="auth-page-root relative -mx-4 -my-10 overflow-hidden bg-white sm:-mx-6 lg:-mx-8">
      <div className="relative mx-auto flex min-h-[min(70vh,720px)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
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
    </div>
  );
}
