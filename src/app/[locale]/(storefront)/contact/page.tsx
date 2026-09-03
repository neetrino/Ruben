import { notFound } from "next/navigation";

import { ContactForm } from "@/features/contact/ui/ContactForm";
import { ContactInfo } from "@/features/contact/ui/ContactInfo";
import { ContactMap } from "@/features/contact/ui/ContactMap";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

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
    <div className="contact-page-root relative z-0 -mx-4 -my-10 bg-white sm:-mx-6 lg:-mx-8">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-10 max-w-2xl sm:mb-14">
          <p className="text-xs font-semibold tracking-[0.18em] text-[var(--brand-deep)] uppercase">
            {dictionary.brand}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
            {copy.subtitle}
          </p>
          <div className="mt-5 h-1.5 w-16 rounded-full bg-[var(--brand)]" />
        </header>

        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
          <ContactInfo copy={copy} />
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
        </div>
      </div>

      <ContactMap title={copy.mapTitle} />
    </div>
  );
}
