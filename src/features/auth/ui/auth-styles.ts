/** Shared auth form styles — aligned with checkout / storefront tokens. */

export const AUTH_FIELD_CLASS =
  "h-11 w-full rounded-[15px] border border-gray-200 bg-white px-4 text-gray-900 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50 disabled:opacity-60";

export const AUTH_PASSWORD_FIELD_CLASS = `${AUTH_FIELD_CLASS} pr-11`;

export const AUTH_LABEL_CLASS =
  "flex flex-col gap-2 text-sm font-medium text-gray-900";

export const AUTH_SUBMIT_CLASS =
  "inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-bold tracking-wide text-black uppercase transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

export const AUTH_MUTED_LINK_CLASS =
  "font-medium text-gray-900 underline-offset-2 transition hover:text-black hover:underline";

export const AUTH_SOFT_LINK_CLASS =
  "text-sm font-medium text-gray-600 underline-offset-2 transition hover:text-gray-900 hover:underline";

export const AUTH_ERROR_CLASS =
  "rounded-[15px] border border-red-200 bg-red-50 p-3 text-sm text-red-600";

export const AUTH_SUCCESS_CLASS =
  "rounded-[15px] border border-green-200 bg-green-50 p-3 text-sm text-green-700";
