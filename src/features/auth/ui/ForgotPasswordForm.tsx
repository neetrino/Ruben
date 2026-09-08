"use client";

import { useActionState } from "react";

import { AppLink } from "@/components/ui/AppLink";
import {
  forgotPasswordAction,
  type ForgotPasswordActionState,
} from "@/features/auth/forgot-password-action";
import {
  AUTH_ERROR_CLASS,
  AUTH_FIELD_CLASS,
  AUTH_LABEL_CLASS,
  AUTH_MUTED_LINK_CLASS,
  AUTH_SUBMIT_CLASS,
  AUTH_SUCCESS_CLASS,
} from "@/features/auth/ui/auth-styles";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const initialState: ForgotPasswordActionState = {};

type ForgotPasswordFormProps = {
  locale: Locale;
  dictionary: Dictionary["auth"];
};

export function ForgotPasswordForm({
  locale,
  dictionary,
}: ForgotPasswordFormProps) {
  const action = forgotPasswordAction.bind(null, locale);
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className={AUTH_LABEL_CLASS}>
        {dictionary.email}
        <input
          required
          name="email"
          type="email"
          autoComplete="email"
          className={AUTH_FIELD_CLASS}
        />
      </label>

      {state.error ? (
        <p role="alert" className={AUTH_ERROR_CLASS}>
          {state.error}
        </p>
      ) : null}

      {state.sent ? (
        <p role="status" className={AUTH_SUCCESS_CLASS}>
          {dictionary.forgotPasswordSuccess}
        </p>
      ) : null}

      <button type="submit" disabled={isPending} className={AUTH_SUBMIT_CLASS}>
        {isPending
          ? dictionary.submittingForgotPassword
          : dictionary.submitForgotPassword}
      </button>

      <p className="text-center text-sm text-gray-600">
        <AppLink
          href={`/${locale}/login`}
          prefetchPolicy="intent"
          className={AUTH_MUTED_LINK_CLASS}
        >
          {dictionary.backToLogin}
        </AppLink>
      </p>
    </form>
  );
}
