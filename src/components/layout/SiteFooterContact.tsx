"use client";

import { ChevronDown, Clock, Mail, MapPin, Phone } from "lucide-react";

import { IconDropdown } from "@/components/ui/IconDropdown";
import { formatBranchAddress, type StoreBranch } from "@/lib/store/branches";
import { toTelHref } from "@/lib/store/phone";

type SiteFooterContactProps = {
  branches: readonly StoreBranch[];
  email: string;
  /** Working hours, one entry per rendered line. */
  hours: readonly string[];
  /** Accessible label for the additional phone numbers menu. */
  phonesLabel: string;
  /** Accessible label for the additional addresses menu. */
  addressesLabel: string;
};

const ROW_CLASS = "flex items-start gap-3";
const ICON_CLASS = "mt-0.5 h-[15px] w-[15px] shrink-0 text-brand";
const TEXT_CLASS = "leading-5 text-white/60";
const LINK_CLASS = `${TEXT_CLASS} transition-colors hover:text-white`;
const CHEVRON_TRIGGER_CLASS =
  "flex shrink-0 items-center text-white/40 transition-colors hover:text-white";
const MENU_CLASS =
  "w-max max-w-[260px] overflow-hidden rounded-[14px] border border-white/10 bg-black p-2 text-sm text-white/60 shadow-[0_18px_40px_rgba(0,0,0,0.45)]";
const MENU_ITEM_CLASS =
  "block rounded-lg px-2.5 py-1.5 leading-5 break-words transition-colors hover:bg-white/10 hover:text-white";

function Chevron({ open }: { open: boolean }) {
  return (
    <ChevronDown
      className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 ease-out motion-reduce:transition-none ${
        open ? "rotate-180" : ""
      }`}
      aria-hidden
    />
  );
}

/**
 * Footer contact column: primary phone and address stay visible, the remaining
 * branches open in a dropdown.
 */
export function SiteFooterContact({
  branches,
  email,
  hours,
  phonesLabel,
  addressesLabel,
}: SiteFooterContactProps) {
  const [primary, ...otherBranches] = branches;

  if (!primary) {
    return null;
  }

  const otherPhones = otherBranches
    .map((branch) => branch.phone)
    .filter((phone): phone is string => phone !== null);

  return (
    <ul className="mt-6 space-y-4 text-sm text-white/60">
      {primary.phone ? (
        <li className={ROW_CLASS}>
          <Phone className={ICON_CLASS} aria-hidden />
          <div className="flex min-w-0 items-center gap-2">
            <a href={toTelHref(primary.phone)} className={LINK_CLASS}>
              {primary.phone}
            </a>
            {otherPhones.length > 0 ? (
              <IconDropdown
                label={phonesLabel}
                triggerClassName={CHEVRON_TRIGGER_CLASS}
                menuClassName={MENU_CLASS}
                trigger={(open) => <Chevron open={open} />}
              >
                {otherPhones.map((phone) => (
                  <a
                    key={phone}
                    href={toTelHref(phone)}
                    className={MENU_ITEM_CLASS}
                  >
                    {phone}
                  </a>
                ))}
              </IconDropdown>
            ) : null}
          </div>
        </li>
      ) : null}

      <li className={ROW_CLASS}>
        <Mail className={ICON_CLASS} aria-hidden />
        <a href={`mailto:${email}`} className={LINK_CLASS}>
          {email}
        </a>
      </li>

      <li className={ROW_CLASS}>
        <MapPin className={ICON_CLASS} aria-hidden />
        {otherBranches.length > 0 ? (
          <IconDropdown
            label={addressesLabel}
            triggerClassName={`${CHEVRON_TRIGGER_CLASS} gap-2`}
            menuClassName={MENU_CLASS}
            trigger={(open) => (
              <>
                <span className={TEXT_CLASS}>
                  {formatBranchAddress(primary)}
                </span>
                <Chevron open={open} />
              </>
            )}
          >
            {otherBranches.map((branch) => (
              <span key={branch.address} className={MENU_ITEM_CLASS}>
                {formatBranchAddress(branch)}
              </span>
            ))}
          </IconDropdown>
        ) : (
          <span className={TEXT_CLASS}>{formatBranchAddress(primary)}</span>
        )}
      </li>

      <li className={ROW_CLASS}>
        <Clock className={ICON_CLASS} aria-hidden />
        <div className="space-y-0.5">
          {hours.map((line) => (
            <p key={line} className={TEXT_CLASS}>
              {line}
            </p>
          ))}
        </div>
      </li>
    </ul>
  );
}
