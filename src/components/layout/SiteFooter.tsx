import Image from "next/image";

import { FOOTER_ASSETS } from "@/components/layout/footer-assets";
import { AppLink } from "@/components/ui/AppLink";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type SiteFooterProps = {
  dictionary: Dictionary;
  locale: Locale;
};

const LINK_CLASS =
  "text-sm leading-5 text-white/50 transition-colors hover:text-white";
const HEADING_CLASS = "text-lg leading-[15px] font-normal text-white uppercase";
const SOCIAL_CLASS =
  "inline-flex size-9 items-center justify-center rounded-full border border-white/18 text-white transition-colors hover:border-white/40 hover:bg-white/5";

export function SiteFooter({ dictionary, locale }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const footer = dictionary.footer;
  const contact = dictionary.contact;

  const navLinks = [
    { href: `/${locale}/products`, label: footer.shop },
    { href: `/${locale}/about`, label: dictionary.nav.about },
    { href: `/${locale}#promotions`, label: footer.specialOffers },
    { href: `/${locale}/blog`, label: footer.gallery },
    { href: `/${locale}/contact`, label: dictionary.nav.contact },
  ] as const;

  const supportLinks = [
    { href: `/${locale}/legal/delivery`, label: footer.deliveryReturns },
    { href: `/${locale}/legal/terms`, label: footer.terms },
    { href: `/${locale}/legal/privacy`, label: footer.privacyPolicy },
    { href: `/${locale}/contact`, label: footer.faq },
  ] as const;

  const socials = [
    {
      href: contact.social.instagram,
      label: "Instagram",
      icon: FOOTER_ASSETS.instagram,
      size: 16,
    },
    {
      href: contact.social.facebook,
      label: "Facebook",
      icon: FOOTER_ASSETS.facebook,
      size: 16,
    },
    {
      href: contact.social.whatsapp,
      label: "WhatsApp",
      icon: FOOTER_ASSETS.whatsapp,
      size: 20,
    },
  ] as const;

  const copyrightPrefix = footer.copyrightPrefix.replace(
    "{year}",
    String(year),
  );

  return (
    <footer className="storefront-footer relative z-10 mt-auto hidden overflow-hidden bg-black text-white md:block">
      {/* Figma 118:970 — left tile plane */}
      <Image
        src={FOOTER_ASSETS.tiles}
        alt=""
        width={1006}
        height={1006}
        className="pointer-events-none absolute top-[-56px] left-[-40%] z-0 hidden h-[1006px] w-[1006px] max-w-none object-cover select-none sm:block lg:left-[-572px]"
        aria-hidden
      />
      {/* Figma 118:969 — right tile plane */}
      <Image
        src={FOOTER_ASSETS.tiles}
        alt=""
        width={1006}
        height={1006}
        className="pointer-events-none absolute top-[-56px] right-[-20%] z-0 h-[1006px] w-[1006px] max-w-none object-cover select-none lg:right-auto lg:left-[434px]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/35" aria-hidden />

      <div className="relative z-10 mx-auto max-w-[1440px] px-[5.56%] pt-24 pb-10 sm:pt-28 lg:pt-32">
        <div className="flex flex-col gap-12 border-b border-white/12 pb-16 lg:flex-row lg:items-start lg:justify-between lg:gap-12 xl:gap-16">
          <div className="max-w-[469px] shrink-0">
            <Image
              src={FOOTER_ASSETS.logo}
              alt={dictionary.brand}
              width={87}
              height={54}
              className="h-[54px] w-auto"
            />
            <p className="mt-8 max-w-[320px] text-sm leading-[22.75px] text-white/45">
              {footer.description}
            </p>
            <div className="mt-8 flex items-center gap-3">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={SOCIAL_CLASS}
                  aria-label={item.label}
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={item.size}
                    height={item.size}
                    className="opacity-90"
                    aria-hidden
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="grid min-w-0 flex-1 grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-8 xl:gap-10">
            <div>
              <h3 className={`${HEADING_CLASS} whitespace-nowrap`}>
                {footer.navigation}
              </h3>
              <ul className="mt-6 space-y-3">
                {navLinks.map((item) => (
                  <li key={item.href + item.label}>
                    <AppLink
                      href={item.href}
                      prefetchPolicy="intent"
                      className={LINK_CLASS}
                    >
                      {item.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3
                className={`${HEADING_CLASS} whitespace-nowrap tracking-[1px]`}
              >
                {footer.support}
              </h3>
              <ul className="mt-6 space-y-4">
                {supportLinks.map((item) => (
                  <li key={item.href}>
                    <AppLink
                      href={item.href}
                      prefetchPolicy="intent"
                      className="text-sm leading-5 text-white/60 transition-colors hover:text-white"
                    >
                      {item.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className={`${HEADING_CLASS} whitespace-nowrap`}>
                {footer.contactInfo}
              </h3>
              <ul className="mt-6 space-y-3 text-sm leading-5 text-white/50">
                <li>{contact.storeAddress}</li>
                <li>
                  <a
                    href={`tel:${contact.storePhone.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-white"
                  >
                    {contact.storePhone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${contact.storeEmail}`}
                    className="transition-colors hover:text-white"
                  >
                    {contact.storeEmail}
                  </a>
                </li>
                <li className="border-t border-white/10 pt-4">
                  {footer.hours}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center pt-8">
          <p className="max-w-full text-center text-sm leading-5 text-white/40">
            <span>{copyrightPrefix} </span>
            <a
              href="https://neetrino.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline-offset-2 transition-opacity hover:underline hover:opacity-90"
            >
              {footer.copyrightCompany}
            </a>
            {footer.copyrightSuffix ? (
              <span> {footer.copyrightSuffix}</span>
            ) : null}
          </p>
        </div>
      </div>
    </footer>
  );
}
