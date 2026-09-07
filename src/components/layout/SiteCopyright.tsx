import type { Dictionary } from "@/lib/i18n/get-dictionary";

const COPYRIGHT_COMPANY_URL = "https://neetrino.com";

type SiteCopyrightProps = {
  dictionary: Dictionary;
  /** Classes for the paragraph wrapper. */
  className?: string;
  /** Classes for the company link. */
  linkClassName?: string;
};

/**
 * Shared copyright line: the desktop footer renders it on black, mobile pages
 * render it at the page end where the footer is hidden.
 */
export function SiteCopyright({
  dictionary,
  className = "",
  linkClassName = "",
}: SiteCopyrightProps) {
  const footer = dictionary.footer;
  const prefix = footer.copyrightPrefix.replace(
    "{year}",
    String(new Date().getFullYear()),
  );

  return (
    <p className={className}>
      <span>{prefix} </span>
      <a
        href={COPYRIGHT_COMPANY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {footer.copyrightCompany}
      </a>
      {footer.copyrightSuffix ? <span> {footer.copyrightSuffix}</span> : null}
    </p>
  );
}
