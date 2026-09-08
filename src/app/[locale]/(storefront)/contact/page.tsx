import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import {
  STOREFRONT_PAGE_SUBTITLE_CLASS,
  STOREFRONT_PAGE_TITLE_CLASS,
} from "@/components/layout/storefront-page-title";
import { Reveal } from "@/components/motion/Reveal";
import { ContactFormSkeleton } from "@/features/contact/ui/ContactFormSkeleton";
import { ContactInfo } from "@/features/contact/ui/ContactInfo";
import { ContactMapSkeleton } from "@/features/contact/ui/ContactMapSkeleton";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const ContactForm = dynamic(
  () =>
    import("@/features/contact/ui/ContactForm").then((mod) => ({
      default: mod.ContactForm,
    })),
  { loading: () => <ContactFormSkeleton /> },
);

const ContactMap = dynamic(
  () =>
    import("@/features/contact/ui/ContactMap").then((mod) => ({
      default: mod.ContactMap,
    })),
  { loading: () => <ContactMapSkeleton /> },
);

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);
  const copy = dictionary.contact;

  return (
    <div className="contact-page-root relative z-0 -mx-4 -mt-10 bg-white sm:-mx-6 lg:-mx-8 lg:-mb-10">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Reveal as="header" className="mb-10 flex max-w-2xl flex-col gap-2 sm:mb-14">
          <h1 className={STOREFRONT_PAGE_TITLE_CLASS}>{copy.title}</h1>
          <p className={STOREFRONT_PAGE_SUBTITLE_CLASS}>{copy.subtitle}</p>
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <ContactInfo copy={copy} />
          </Reveal>
          <Reveal delay={0.08}>
            <ContactForm
              copy={{
                name: copy.name,
                email: copy.email,
                phone: copy.phone,
                message: copy.message,
                submit: copy.submit,
                success: copy.success,
                error: copy.error,
              }}
            />
          </Reveal>
        </div>
      </div>

      <Reveal>
        <ContactMap
          title={copy.mapTitle}
          tabsTitle={copy.mapTabsTitle}
          branches={copy.branches}
        />
      </Reveal>
    </div>
  );
}
