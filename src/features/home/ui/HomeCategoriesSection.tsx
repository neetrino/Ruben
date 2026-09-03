import dynamic from "next/dynamic";

import { HomeCategoriesSkeleton } from "@/components/loading/storefront-skeletons";
import { listStorefrontCategories } from "@/features/home/application/list-storefront-categories";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const HomeCategories = dynamic(
  () =>
    import("@/features/home/ui/HomeCategories").then((mod) => ({
      default: mod.HomeCategories,
    })),
  { loading: () => <HomeCategoriesSkeleton /> },
);

type HomeCategoriesSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/** Streams category carousel independently of product rails. */
export async function HomeCategoriesSection({
  locale,
  dictionary,
}: HomeCategoriesSectionProps) {
  const categories = await listStorefrontCategories(locale);
  const productsHref = `/${locale}/products`;

  const categoryCards = categories.map((category) => ({
    id: category.id,
    title: category.title,
    href: `${productsHref}?category=${encodeURIComponent(category.slug)}`,
    imageUrl: category.imageUrl,
  }));

  return (
    <HomeCategories
      categories={categoryCards}
      emptyLabel={dictionary.home.categoriesEmpty}
      prevLabel={dictionary.home.categoriesPrev}
      nextLabel={dictionary.home.categoriesNext}
    />
  );
}
