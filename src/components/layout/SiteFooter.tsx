import { Mail, MapPin, Phone } from "lucide-react";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/layout/SocialIcons";
import { AppLink } from "@/components/ui/AppLink";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { STORE_MAP_EMBED_SRC } from "@/lib/store/map-embed";

type SiteFooterProps = {
  dictionary: Dictionary;
  locale: Locale;
};

export function SiteFooter({ dictionary, locale }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="storefront-footer mt-auto border-t border-gray-800 bg-black pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              {dictionary.footer.shop}
            </h3>
            <p className="text-sm text-gray-300">{dictionary.footer.description}</p>
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-semibold text-white">
                {dictionary.footer.social}
              </h4>
              <div className="flex items-center gap-4 text-gray-300">
                <a
                  href={dictionary.contact.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a
                  href={dictionary.contact.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="h-5 w-5" />
                </a>
                <a
                  href={dictionary.contact.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              {dictionary.footer.legal}
            </h4>
            <ul className="space-y-2">
              <li>
                <AppLink
                  href={`/${locale}/legal/privacy`}
                  prefetchPolicy="intent"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  {dictionary.footer.privacyPolicy}
                </AppLink>
              </li>
              <li>
                <AppLink
                  href={`/${locale}/legal/terms`}
                  prefetchPolicy="intent"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  {dictionary.footer.terms}
                </AppLink>
              </li>
              <li>
                <AppLink
                  href={`/${locale}/legal/refund`}
                  prefetchPolicy="intent"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  {dictionary.footer.refundPolicy}
                </AppLink>
              </li>
              <li>
                <AppLink
                  href={`/${locale}/legal/delivery`}
                  prefetchPolicy="intent"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  {dictionary.footer.deliveryPolicy}
                </AppLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              {dictionary.footer.contactInfo}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                <span className="text-sm text-gray-300">
                  {dictionary.contact.storeAddress}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 shrink-0 text-gray-400" />
                <a
                  href={`tel:${dictionary.contact.storePhone}`}
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  {dictionary.contact.storePhone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 shrink-0 text-gray-400" />
                <a
                  href={`mailto:${dictionary.contact.storeEmail}`}
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  {dictionary.contact.storeEmail}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              {dictionary.footer.map}
            </h4>
            <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
              <iframe
                title={dictionary.contact.mapTitle}
                src={STORE_MAP_EMBED_SRC}
                width="100%"
                height="180"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-300 md:text-left">
            {dictionary.footer.copyright.replace("{year}", String(year))}
          </p>
        </div>
      </div>
    </footer>
  );
}
