/** Placeholder while the contact form client chunk loads. */
export function ContactFormSkeleton() {
  return (
    <div
      className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-[20px] border border-gray-200/80 bg-white shadow-[0_18px_50px_-28px_rgba(17,24,39,0.22)]"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="h-1.5 w-full shrink-0 bg-[var(--brand)]" />
      <div className="flex flex-1 animate-pulse flex-col space-y-5 px-6 py-6 sm:px-8 sm:py-8">
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-gray-100" />
          <div className="h-11 w-full rounded-[15px] bg-gray-100" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-gray-100" />
          <div className="h-11 w-full rounded-[15px] bg-gray-100" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-gray-100" />
          <div className="h-11 w-full rounded-[15px] bg-gray-100" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-gray-100" />
          <div className="min-h-[140px] w-full rounded-[15px] bg-gray-100" />
        </div>
        <div className="mt-auto h-12 w-full rounded-full bg-gray-100" />
      </div>
    </div>
  );
}
