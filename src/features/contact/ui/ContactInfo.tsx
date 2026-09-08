import { Clock, Mail, MapPin, Phone } from "lucide-react";

import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { formatBranchAddress, type StoreBranch } from "@/lib/store/branches";
import { toTelHref } from "@/lib/store/phone";

type ContactInfoProps = {
  copy: Dictionary["contact"];
};

const EYEBROW_CLASS =
  "text-[11px] font-bold tracking-[0.08em] text-gray-500 uppercase";
const ROW_CLASS = "flex items-start gap-2.5";
const ICON_CLASS = "mt-0.5 h-[18px] w-[18px] shrink-0 text-[var(--brand)]";
const VALUE_CLASS =
  "text-sm leading-snug font-medium text-gray-900 sm:text-base";
const LINK_CLASS =
  "text-sm leading-snug font-semibold text-gray-900 transition-colors hover:text-black sm:text-base";

export function ContactInfo({ copy }: ContactInfoProps) {
  const branches: readonly StoreBranch[] = copy.branches;

  return (
    <div className="flex w-full flex-col gap-8">
      <div>
        <p className={EYEBROW_CLASS}>{copy.branchesTitle}</p>
        <ul className="mt-4 space-y-4">
          {branches.map((branch, index) => (
            <li key={branch.address} className="space-y-2">
              <div className={ROW_CLASS}>
                <MapPin className={ICON_CLASS} aria-hidden />
                <p className={VALUE_CLASS}>{formatBranchAddress(branch)}</p>
              </div>

              {branch.phone ? (
                <div className={ROW_CLASS}>
                  <Phone className={ICON_CLASS} aria-hidden />
                  <a href={toTelHref(branch.phone)} className={LINK_CLASS}>
                    {branch.phone}
                  </a>
                </div>
              ) : null}

              {index < branches.length - 1 ? (
                <div
                  className="h-px w-full max-w-sm bg-gray-200"
                  aria-hidden
                />
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div className={ROW_CLASS}>
        <Mail className={ICON_CLASS} aria-hidden />
        <a href={`mailto:${copy.storeEmail}`} className={LINK_CLASS}>
          {copy.storeEmail}
        </a>
      </div>

      <div>
        <p className={EYEBROW_CLASS}>{copy.hoursTitle}</p>
        <div className={`${ROW_CLASS} mt-3`}>
          <Clock className={ICON_CLASS} aria-hidden />
          <div className={VALUE_CLASS}>
            <p>{copy.hoursWeekdays}</p>
            <p>{copy.hoursSunday}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
