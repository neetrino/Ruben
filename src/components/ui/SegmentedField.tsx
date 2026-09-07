import type { ReactNode } from "react";

type SegmentedFieldProps = {
  label: string;
  /** Segments: links or buttons styled with {@link segmentedItemClass}. */
  children: ReactNode;
};

/** Shared classes for one segment inside a {@link SegmentedField} track. */
export function segmentedItemClass(selected: boolean): string {
  const base =
    "flex items-center justify-center rounded-full px-2.5 py-1.5 text-center text-xs transition-colors";

  return selected
    ? `${base} bg-[var(--brand)] font-semibold text-gray-900`
    : `${base} font-medium text-gray-500 hover:text-gray-900`;
}

/**
 * Labeled segmented control — a pill track where the active option reads as a
 * raised white chip. Used for the mobile language and currency switchers.
 */
export function SegmentedField({ label, children }: SegmentedFieldProps) {
  return (
    <div className="w-fit">
      <p className="mb-1.5 px-1 text-xs text-gray-400" aria-hidden>
        {label}
      </p>
      <div
        role="group"
        aria-label={label}
        className="inline-flex items-center gap-0.5 rounded-full bg-gray-100 p-1"
      >
        {children}
      </div>
    </div>
  );
}
