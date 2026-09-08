/** Formats a Date as `YYYY-MM-DD` in Asia/Yerevan. */
export function formatYerevanDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Yerevan",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
