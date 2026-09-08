"use client";

import { useState, useTransition } from "react";

import { submitContactMessageAction } from "@/features/contact/application/submit-contact";

type ContactFormCopy = {
  name: string;
  email: string;
  phone: string;
  message: string;
  submit: string;
  success: string;
  error: string;
};

type ContactFormProps = {
  copy: ContactFormCopy;
};

const FIELD_CLASS =
  "h-11 w-full rounded-[15px] border border-gray-200 bg-white px-4 text-gray-900 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50 disabled:opacity-60";

const LABEL_CLASS = "flex flex-col gap-2 text-sm font-medium text-gray-900";

export function ContactForm({ copy }: ContactFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (success) {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-[20px] border border-gray-200/80 bg-white shadow-[0_18px_50px_-28px_rgba(17,24,39,0.22)]">
        <div className="h-1.5 w-full bg-[var(--brand)]" />
        <p
          role="status"
          className="m-6 rounded-[15px] border border-green-200 bg-green-50 p-4 text-sm text-green-700 sm:m-8"
        >
          {copy.success}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[20px] border border-gray-200/80 bg-white shadow-[0_18px_50px_-28px_rgba(17,24,39,0.22)]">
      <div className="h-1.5 w-full shrink-0 bg-[var(--brand)]" />
      <form
        className="flex flex-1 flex-col space-y-5 px-6 py-6 sm:px-8 sm:py-8"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);

          startTransition(async () => {
            setError(null);
            const result = await submitContactMessageAction({
              name: String(formData.get("name") ?? ""),
              email: String(formData.get("email") ?? ""),
              phone: String(formData.get("phone") ?? "") || undefined,
              message: String(formData.get("message") ?? ""),
            });

            if (!result.ok) {
              setError(result.error.message || copy.error);
              return;
            }

            setSuccess(true);
          });
        }}
      >
        <label className={LABEL_CLASS}>
          <span>{copy.name}</span>
          <input
            name="name"
            required
            maxLength={120}
            autoComplete="name"
            className={FIELD_CLASS}
            disabled={isPending}
          />
        </label>

        <label className={LABEL_CLASS}>
          <span>{copy.email}</span>
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className={FIELD_CLASS}
            disabled={isPending}
          />
        </label>

        <label className={LABEL_CLASS}>
          <span>{copy.phone}</span>
          <input
            name="phone"
            type="tel"
            maxLength={40}
            autoComplete="tel"
            className={FIELD_CLASS}
            disabled={isPending}
          />
        </label>

        <label className={LABEL_CLASS}>
          <span>{copy.message}</span>
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={6}
            className="min-h-[140px] w-full resize-y rounded-[15px] border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50 disabled:opacity-60"
            disabled={isPending}
          />
        </label>

        {error ? (
          <p
            role="alert"
            className="rounded-[15px] border border-red-200 bg-red-50 p-3 text-sm text-red-600"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-auto inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--brand)] px-6 text-sm font-bold tracking-wide text-black uppercase transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
        >
          {isPending ? "…" : copy.submit}
        </button>
      </form>
    </div>
  );
}
