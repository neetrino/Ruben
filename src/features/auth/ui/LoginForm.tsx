"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { AppLink } from "@/components/ui/AppLink";
import { loginAction, type AuthActionState } from "@/features/auth/login-action";
import {
  AUTH_ERROR_CLASS,
  AUTH_FIELD_CLASS,
  AUTH_LABEL_CLASS,
  AUTH_MUTED_LINK_CLASS,
  AUTH_SOFT_LINK_CLASS,
  AUTH_SUBMIT_CLASS,
  AUTH_SUCCESS_CLASS,
} from "@/features/auth/ui/auth-styles";
import { PasswordField } from "@/features/auth/ui/PasswordField";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const initialState: AuthActionState = {};

type LoginFormProps = {
  locale: Locale;
  dictionary: Dictionary["auth"];
};

export function LoginForm({ locale, dictionary }: LoginFormProps) {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const resetSucceeded = searchParams.get("reset") === "1";
  const action = loginAction.bind(null, locale);
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

      {resetSucceeded ? (
        <p role="status" className={AUTH_SUCCESS_CLASS}>
          {dictionary.resetPasswordSuccess}
        </p>
      ) : null}

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
      <PasswordField
        name="password"
        label={dictionary.password}
        showPasswordLabel={dictionary.showPassword}
        hidePasswordLabel={dictionary.hidePassword}
        autoComplete="current-password"
      />
      <div className="flex justify-end">
        <AppLink
          href={`/${locale}/forgot-password`}
          prefetchPolicy="intent"
          className={AUTH_SOFT_LINK_CLASS}
        >
          {dictionary.forgotPassword}
        </AppLink>
      </div>
      {state.error ? (
        <p role="alert" className={AUTH_ERROR_CLASS}>
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={isPending} className={AUTH_SUBMIT_CLASS}>
        {isPending ? "…" : dictionary.submitLogin}
      </button>
      <p className="text-center text-sm text-gray-600">
        <AppLink
          href={`/${locale}/register`}
          prefetchPolicy="intent"
          className={AUTH_MUTED_LINK_CLASS}
        >
          {dictionary.submitRegister}
        </AppLink>
      </p>
    </form>
  );
}
