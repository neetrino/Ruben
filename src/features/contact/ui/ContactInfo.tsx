import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

import type { Dictionary } from "@/lib/i18n/get-dictionary";

type ContactInfoProps = {
  copy: Dictionary["contact"];
};

function InfoRow({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-black">
        {icon}
      </div>
      <div className="min-w-0 pt-0.5">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900">
          {title}
        </h2>
        <div className="mt-2 space-y-1.5 text-sm leading-relaxed text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
}

const linkClassName =
  "font-semibold text-gray-900 underline-offset-2 transition hover:text-black hover:underline";

export function ContactInfo({ copy }: ContactInfoProps) {
  return (
    <div className="flex h-full flex-col space-y-8 rounded-[20px] border border-gray-200/80 bg-white p-6 shadow-[0_18px_50px_-28px_rgba(17,24,39,0.22)] sm:p-8">
      <InfoRow icon={<Phone className="h-5 w-5" strokeWidth={2.25} />} title={copy.callTitle}>
        <p>{copy.callDescription}</p>
        <a href={`tel:${copy.storePhone}`} className={linkClassName}>
          {copy.storePhone}
        </a>
      </InfoRow>

      <div className="h-px bg-gray-100" aria-hidden />

      <InfoRow icon={<Mail className="h-5 w-5" strokeWidth={2.25} />} title={copy.writeTitle}>
        <p>{copy.writeDescription}</p>
        <a href={`mailto:${copy.storeEmail}`} className={linkClassName}>
          {copy.emailLabel} {copy.storeEmail}
        </a>
      </InfoRow>

      <div className="h-px bg-gray-100" aria-hidden />

      <InfoRow icon={<MapPin className="h-5 w-5" strokeWidth={2.25} />} title={copy.hqTitle}>
        <p>{copy.hoursWeekdays}</p>
        <p>{copy.hoursSaturday}</p>
        <p className="pt-1 font-semibold text-gray-900">{copy.storeAddress}</p>
      </InfoRow>
    </div>
  );
}
