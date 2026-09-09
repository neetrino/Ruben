"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { ProfileMobileHub } from "@/features/profile/ui/ProfileMobileHub";
import { ProfileMobileTabSheet } from "@/features/profile/ui/ProfileMobileTabSheet";
import { ProfilePageReveal } from "@/features/profile/ui/ProfilePageReveal";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { scheduleStateUpdate } from "@/lib/react/schedule-after-paint";
import type { Locale } from "@/lib/i18n/config";
import type { SessionUser } from "@/lib/auth/session";

/** Must stay paired with the `lg` breakpoint used by the profile layout CSS. */
const PROFILE_DESKTOP_MEDIA_QUERY = "(min-width: 1025px)";

type ProfileMobileShellProps = {
  locale: Locale;
  user: SessionUser;
  dictionary: Dictionary["profile"];
  children: ReactNode;
};

function isProfileHubPath(pathname: string, locale: Locale): boolean {
  const hubHref = `/${locale}/profile`;
  return pathname === hubHref || pathname === `${hubHref}/`;
}

/**
 * Mobile profile shell: hub always visible; section content in a bottom sheet.
 * Desktop: sticky content column (Kamancha) — page can still scroll to footer.
 */
export function ProfileMobileShell({
  locale,
  user,
  dictionary,
  children,
}: ProfileMobileShellProps) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const isHub = isProfileHubPath(pathname, locale);
  const [hubSheetOpen, setHubSheetOpen] = useState(false);
  /** Keeps sub-route content mounted while the close keyframe plays. */
  const [closingToHub, setClosingToHub] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const desktopContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia(PROFILE_DESKTOP_MEDIA_QUERY);
    function sync(): void {
      setIsDesktop(media.matches);
    }
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (isHub) {
      scheduleStateUpdate(setHubSheetOpen, false);
      scheduleStateUpdate(setClosingToHub, false);
    }
  }, [isHub, pathname]);

  // The desktop column keeps its own scrollport across route changes, so a new
  // section would otherwise open at the previous scroll offset.
  useEffect(() => {
    desktopContentRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  const sheetOpen = (!isHub || hubSheetOpen) && !closingToHub;

  const closeSheet = useCallback(() => {
    if (isHub) {
      setHubSheetOpen(false);
      return;
    }
    setClosingToHub(true);
  }, [isHub]);

  const handleSheetExited = useCallback(() => {
    if (!closingToHub) return;
    // Keep `closingToHub` true until the hub route mounts — otherwise
    // `sheetOpen` flips back on and the sheet re-opens with a jerk.
    router.push(`/${locale}/profile`);
  }, [closingToHub, locale, router]);

  const openHubDashboard = useCallback(() => {
    setHubSheetOpen(true);
  }, []);

  const hub = (
    <ProfileMobileHub
      locale={locale}
      user={user}
      dictionary={dictionary}
      onOpenDashboard={openHubDashboard}
    />
  );

  const revealed = (
    <ProfilePageReveal y={isDesktop ? 18 : 0}>{children}</ProfilePageReveal>
  );

  const desktopColumn = (
    <div
      ref={desktopContentRef}
      className="profile-desktop-content profile-sticky-band min-w-0 flex-1"
    >
      {revealed}
    </div>
  );

  let content: ReactNode;

  // SSR / pre-hydration: hub on mobile via CSS; content only from lg up.
  if (isDesktop === null) {
    content = (
      <>
        <div className="profile-mobile-page w-full lg:hidden">{hub}</div>
        <div
          ref={desktopContentRef}
          className="profile-desktop-content profile-sticky-band hidden min-w-0 flex-1 lg:block"
        >
          {revealed}
        </div>
      </>
    );
  } else if (isDesktop) {
    content = desktopColumn;
  } else {
    content = (
      <div className="profile-mobile-page w-full">
        {hub}
        <ProfileMobileTabSheet
          open={sheetOpen}
          onClose={closeSheet}
          onExited={handleSheetExited}
          ariaLabel={dictionary.title}
        >
          {revealed}
        </ProfileMobileTabSheet>
      </div>
    );
  }

  return content;
}
