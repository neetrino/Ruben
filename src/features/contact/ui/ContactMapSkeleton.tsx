/** Placeholder while the map client chunk loads. */
export function ContactMapSkeleton() {
  return (
    <section
      className="relative z-10 mt-4 border-t border-gray-100 bg-white px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="mx-auto max-w-7xl pt-10 sm:pt-12">
        <div className="overflow-hidden rounded-[20px] border border-gray-200/80 bg-gray-100 shadow-[0_18px_50px_-28px_rgba(17,24,39,0.22)]">
          <div className="h-[min(500px,70vw)] w-full animate-pulse bg-gray-100 sm:h-[500px]" />
        </div>
      </div>
    </section>
  );
}
