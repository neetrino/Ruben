import Link from "next/link";
import { notFound } from "next/navigation";

import { COMPARE_MAX_PRODUCTS } from "@/features/compare/constants";
import { listCompareProducts } from "@/features/compare/queries";
import { ClearCompareButton } from "@/features/compare/ui/ClearCompareButton";
import { CompareTable } from "@/features/compare/ui/CompareTable";
import { getCurrentUser } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  createDisplayPriceFormatter,
  getSelectedCurrency,
} from "@/lib/money/display-price";

type ComparePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ComparePage({ params }: ComparePageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);
  const [user, currency, products] = await Promise.all([
    getCurrentUser(),
    getSelectedCurrency(),
    listCompareProducts(rawLocale),
  ]);

  if (!user) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          {dictionary.nav.compare}
        </h1>
        <p className="text-gray-600">
          <Link
            href={`/${rawLocale}/login?next=${encodeURIComponent(`/${rawLocale}/compare`)}`}
            className="font-medium text-gray-900 underline underline-offset-2"
          >
            {dictionary.header.login}
          </Link>{" "}
          — {dictionary.compare.signInPrompt}
        </p>
      </section>
    );
  }

  const formatPrice = await createDisplayPriceFormatter(rawLocale, currency);
  const priced = products.map((product) => {
    const price = formatPrice(product.priceAmount);
    const compareAt =
      product.compareAtAmount != null
        ? formatPrice(product.compareAtAmount)
        : null;

    return {
      product,
      priceFormatted: price.formatted,
      compareAtFormatted: compareAt?.formatted ?? null,
    };
  });

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            {dictionary.nav.compare}
          </h1>
          <p className="text-sm text-gray-600">
            {dictionary.compare.limitHint.replace(
              "{max}",
              String(COMPARE_MAX_PRODUCTS),
            )}
          </p>
        </div>
        {priced.length > 0 ? (
          <ClearCompareButton label={dictionary.compare.clearAll} />
        ) : null}
      </div>

      {priced.length === 0 ? (
        <p className="text-gray-600">
          {dictionary.compare.empty}{" "}
          <Link
            href={`/${rawLocale}/products`}
            className="font-medium text-gray-900 underline underline-offset-2"
          >
            {dictionary.product.backToProducts}
          </Link>
        </p>
      ) : (
        <CompareTable
          locale={rawLocale}
          items={priced}
          labels={{
            product: dictionary.compare.rows.product,
            price: dictionary.compare.rows.price,
            compareAt: dictionary.compare.rows.compareAt,
            discount: dictionary.compare.rows.discount,
            sku: dictionary.compare.rows.sku,
            availability: dictionary.compare.rows.availability,
            categories: dictionary.compare.rows.categories,
            description: dictionary.compare.rows.description,
            inStock: dictionary.product.inStock,
            outOfStock: dictionary.product.outOfStock,
            remove: dictionary.compare.remove,
            addToCart: dictionary.product.addToCart,
            emptyValue: dictionary.compare.emptyValue,
          }}
        />
      )}
    </section>
  );
}
