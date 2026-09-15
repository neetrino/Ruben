import type { Dictionary } from "@/lib/i18n/get-dictionary";

const COPYRIGHT_COMPANY_URL = "https://neetrino.com";

type SiteCopyrightProps = {
  dictionary: Dictionary;
  /** Classes for the paragraph wrapper. */
  className?: string;
  /** Classes for the company link. */
  linkClassName?: string;
  /** Puts the "Created by …" credit on its own line (narrow viewports). */
  createdByOnNewLine?: boolean;
  /** Compact mobile line: `© {year} | CREATED BY NEETRINO`. */
  compact?: boolean;
};

/**
 * Shared copyright line: the desktop footer renders it on black, mobile pages
 * render it at the page end where the footer is hidden.
 */
export function SiteCopyright({
  dictionary,
  className = "",
  linkClassName = "",
  createdByOnNewLine = false,
  compact = false,
}: SiteCopyrightProps) {
  const footer = dictionary.footer;
  const year = String(new Date().getFullYear());
  const prefix = (compact ? footer.copyrightMobilePrefix : footer.copyrightPrefix).replace(
    "{year}",
    year,
  );
  const company = compact
    ? footer.copyrightMobileCompany
    : footer.copyrightCompany;

  return (
    <p className={`uppercase ${className}`.trim()}>
      <span>{prefix} </span>
      <span className={!compact && createdByOnNewLine ? "block" : undefined}>
        <span>{footer.copyrightCreatedBy} </span>
        <a
          href={COPYRIGHT_COMPANY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-bold ${linkClassName}`}
        >
          {company}
        </a>
        {!compact && footer.copyrightSuffix ? (
          <span> {footer.copyrightSuffix}</span>
        ) : null}
      </span>
    </p>
  );
}
