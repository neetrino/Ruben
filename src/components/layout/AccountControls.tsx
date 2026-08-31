"use client";

import Image from "next/image";
import { User } from "lucide-react";

import { HEADER_ASSETS } from "@/components/layout/header-assets";
import { AppLink } from "@/components/ui/AppLink";
import { IconDropdown } from "@/components/ui/IconDropdown";
import { logoutAction } from "@/features/auth/logout-action";
import type { Locale } from "@/lib/i18n/config";
import type { SessionUser } from "@/lib/auth/session";

type AccountControlsProps = {
  locale: Locale;
  loginLabel: string;
  logoutLabel: string;
  profileLabel: string;
  adminLabel: string;
  user: SessionUser | null;
  appearance?: "default" | "navbar";
};

const menuItemClassName =
  "block w-full whitespace-nowrap px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900";

function iconButtonClassName(
  appearance: "default" | "navbar",
  active = false,
): string {
  if (appearance === "navbar") {
    return "inline-flex size-[31px] items-center justify-center overflow-hidden rounded-full transition-opacity hover:opacity-90";
  }
  const base =
    "inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-150";
  return active
    ? `${base} bg-gray-100 text-gray-900 ring-1 ring-gray-200/90`
    : `${base} text-gray-700 hover:text-gray-900`;
}

export function AccountControls({
  locale,
  loginLabel,
  logoutLabel,
  profileLabel,
  adminLabel,
  user,
  appearance = "default",
}: AccountControlsProps) {
  const logoutWithLocale = logoutAction.bind(null, locale);
  const trigger =
    appearance === "navbar" ? (
      <Image
        src={HEADER_ASSETS.user}
        alt=""
        width={31}
        height={31}
        className="size-[31px]"
        aria-hidden
      />
    ) : (
      <User className="h-5 w-5" aria-hidden="true" />
    );

  if (!user) {
    return (
      <AppLink
        href={`/${locale}/login`}
        prefetchPolicy="intent"
        className={iconButtonClassName(appearance)}
        aria-label={loginLabel}
      >
        {trigger}
      </AppLink>
    );
  }

  return (
    <IconDropdown
      label={profileLabel}
      triggerClassName={iconButtonClassName(appearance)}
      trigger={trigger}
      openOnHover
    >
      {user.role === "ADMIN" ? (
        <AppLink
          href={`/${locale}/admin`}
          prefetchPolicy="intent"
          role="menuitem"
          className={menuItemClassName}
        >
          {adminLabel}
        </AppLink>
      ) : null}
      <AppLink
        href={`/${locale}/profile`}
        prefetchPolicy="intent"
        role="menuitem"
        className={menuItemClassName}
      >
        {profileLabel}
      </AppLink>
      <form action={logoutWithLocale} className="w-full">
        <button type="submit" role="menuitem" className={menuItemClassName}>
          {logoutLabel}
        </button>
      </form>
    </IconDropdown>
  );
}
