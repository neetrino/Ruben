import { formatAdminPlacedParts } from "@/features/admin/ui/format-admin-placed";

type AdminPlacedStampProps = {
  value: string | Date;
  className?: string;
};

/**
 * Shared admin/profile placed stamp — semibold time over grey date.
 */
export function AdminPlacedStamp({
  value,
  className = "",
}: AdminPlacedStampProps) {
  const placed = formatAdminPlacedParts(value);

  return (
    <div
      className={`inline-flex flex-col items-center leading-tight ${className}`.trim()}
    >
      <span className="text-base font-semibold tracking-tight text-gray-900 tabular-nums">
        {placed.time}
      </span>
      <span className="mt-0.5 text-xs font-normal text-gray-500 tabular-nums">
        {placed.date}
      </span>
    </div>
  );
}
