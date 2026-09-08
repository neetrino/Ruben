import type { ReactNode } from "react";
import { Clock, Mail, MapPin } from "lucide-react";

import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { formatBranchAddress, type StoreBranch } from "@/lib/store/branches";
import { toTelHref } from "@/lib/store/phone";

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
  const branches: readonly StoreBranch[] = copy.branches;

  return (
    <div className="flex h-full flex-col space-y-8 rounded-[20px] border border-gray-200/80 bg-white p-6 shadow-[0_18px_50px_-28px_rgba(17,24,39,0.22)] sm:p-8">
      <InfoRow
        icon={<MapPin className="h-5 w-5" strokeWidth={2.25} />}
        title={copy.branchesTitle}
      >
        <ul className="space-y-2">
          {branches.map((branch) => (
            <li
              key={branch.address}
              className="flex flex-wrap items-baseline gap-x-2"
            >
              <span>{formatBranchAddress(branch)}</span>
              {branch.phone ? (
                <a href={toTelHref(branch.phone)} className={linkClassName}>
                  {branch.phone}
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </InfoRow>

      <div className="h-px bg-gray-100" aria-hidden />

      <InfoRow
        icon={<Mail className="h-5 w-5" strokeWidth={2.25} />}
        title={copy.writeTitle}
      >
        <p>{copy.writeDescription}</p>
        <a href={`mailto:${copy.storeEmail}`} className={linkClassName}>
          {copy.emailLabel} {copy.storeEmail}
        </a>
      </InfoRow>

      <div className="h-px bg-gray-100" aria-hidden />

      <InfoRow
        icon={<Clock className="h-5 w-5" strokeWidth={2.25} />}
        title={copy.hoursTitle}
      >
        <p>{copy.hoursWeekdays}</p>
        <p>{copy.hoursSunday}</p>
      </InfoRow>
    </div>
  );
}
