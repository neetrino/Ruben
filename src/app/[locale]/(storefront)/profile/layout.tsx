import { notFound } from "next/navigation";
import Image from "next/image";

import { HOME_ASSETS } from "@/features/home/config/assets";
import { ProfileMobileShell } from "@/features/profile/ui/ProfileMobileShell";
import { ProfileSessionProvider } from "@/features/profile/ui/ProfileSessionContext";
import { ProfileSidebar } from "@/features/profile/ui/ProfileSidebar";
import { requireUser } from "@/lib/auth/policies";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type ProfileLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function ProfileLayout({
  children,
  params,
}: ProfileLayoutProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const user = await requireUser(rawLocale);
  const dictionary = getDictionary(rawLocale);

  return (
    <ProfileSessionProvider user={user}>
      {/* Bleed like auth so the hero yellow wave can paint past main padding. */}
      <div className="profile-desktop-page relative z-0 -mx-4 flex flex-col gap-6 px-4 pb-10 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:flex-1 xl:flex-row xl:items-start xl:gap-8 xl:pb-0">
        <div className="relative z-10 contents xl:flex xl:flex-1 xl:flex-row xl:items-start xl:gap-8">
          <div className="profile-desktop-sidebar profile-sticky-band hidden w-[280px] shrink-0 xl:block">
            <ProfileSidebar
              locale={rawLocale}
              user={user}
              dictionary={dictionary.profile}
            />
          </div>

          <ProfileMobileShell
            locale={rawLocale}
            user={user}
            dictionary={dictionary.profile}
          >
            {children}
          </ProfileMobileShell>
        </div>

        {/* Same yellow stroke as auth / home hero — behind profile chrome. */}
        <div
          className="pointer-events-none absolute inset-0 z-0 hidden md:block"
          aria-hidden
        >
          <Image
            src={HOME_ASSETS.heroWave}
            alt=""
            width={1370}
            height={1380}
            priority
            className="absolute top-[-200px] right-[-280px] h-auto w-[1100px] max-w-none select-none lg:right-[-160px] lg:w-[1280px]"
          />
        </div>
      </div>
    </ProfileSessionProvider>
  );
}
