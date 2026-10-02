import { revalidatePath } from "next/cache";

/** Invalidates the admin attributes CMS page for a locale. */
export function revalidateAttributes(locale: string): void {
  revalidatePath(`/${locale}/admin/attributes`);
}
