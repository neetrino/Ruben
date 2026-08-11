export default function CompareLoading() {
  return (
    <section className="flex flex-col gap-8" aria-hidden="true">
      <div className="h-9 w-48 animate-pulse rounded bg-gray-100" />
      <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
    </section>
  );
}
