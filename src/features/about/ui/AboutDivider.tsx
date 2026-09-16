export function AboutDivider() {
  return (
    <div
      className="flex items-center justify-center gap-3 px-6 py-0.5 sm:gap-4 sm:px-10"
      aria-hidden
    >
      <span className="h-px w-full max-w-[120px] bg-gradient-to-r from-transparent via-brand/25 to-brand/40 sm:max-w-[180px]" />
      <span className="relative flex size-3 items-center justify-center">
        <span className="absolute size-3 rounded-full bg-brand/35 blur-[2px]" />
        <span className="relative size-1.5 rounded-full bg-brand" />
      </span>
      <span className="h-px w-full max-w-[120px] bg-gradient-to-l from-transparent via-brand/25 to-brand/40 sm:max-w-[180px]" />
    </div>
  );
}
