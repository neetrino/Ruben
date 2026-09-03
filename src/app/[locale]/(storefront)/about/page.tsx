import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { LazyWhenVisible } from "@/components/loading/LazyWhenVisible";
import { GenericPageSkeleton } from "@/components/loading/storefront-skeletons";
import { AboutHero } from "@/features/about/ui/AboutHero";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const AboutTeam = dynamic(
  () =>
    import("@/features/about/ui/AboutTeam").then((mod) => ({
      default: mod.AboutTeam,
    })),
  { loading: () => <GenericPageSkeleton /> },
);

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);

  return (
    <div className="-mx-4 -my-10 bg-white sm:-mx-6 lg:-mx-8">
      <AboutHero copy={dictionary.about} />
      <LazyWhenVisible fallback={<GenericPageSkeleton />}>
        <AboutTeam copy={dictionary.about} />
      </LazyWhenVisible>
    </div>
  );
}
