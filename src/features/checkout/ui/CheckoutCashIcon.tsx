type CheckoutCashIconProps = {
  sizePx?: number;
  className?: string;
};

/** Banknote icon — matches MaMarie checkout cash payment artwork. */
export function CheckoutCashIcon({
  sizePx = 36,
  className = "text-gray-900",
}: CheckoutCashIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`shrink-0 ${className}`.trim()}
      style={{ width: sizePx, height: sizePx }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="3"
        y="9"
        width="26"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="16" cy="16" r="3.25" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 13h26" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}
