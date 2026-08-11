import { notFound } from "next/navigation";

import { AppLink } from "@/components/ui/AppLink";
import { listCatalogProducts } from "@/features/products/application/list-catalog-products";
import { buildCatalogPriceSliderBounds } from "@/features/products/domain/catalog-price-ranges";
import { catalogHref } from "@/features/products/domain/catalog-url";
import {
  catalogListFilterSchema,
  DEFAULT_CATALOG_FILTERS,
  type CatalogListFilter,
} from "@/features/products/schemas/catalog-list";
import { CatalogActiveFilters } from "@/features/products/ui/CatalogActiveFilters";
import { CatalogFilters } from "@/features/products/ui/CatalogFilters";
import { CatalogSortSelect } from "@/features/products/ui/CatalogSortSelect";
import { ProductCard } from "@/features/products/ui/ProductCard";
import { getWishlistProductIds } from "@/features/wishlist/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { getCheckoutRateSnapshot } from "@/lib/fx/service";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  createDisplayPriceFormatter,
  getSelectedCurrency,
} from "@/lib/money/display-price";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function parseCatalogFilters(
  raw: Record<string, string | string[] | undefined>,
): CatalogListFilter {
  const parsed = catalogListFilterSchema.safeParse({
    q: firstParam(raw.q),
    minPrice: firstParam(raw.minPrice),
    maxPrice: firstParam(raw.maxPrice),
    category: firstParam(raw.category),
    inStock: firstParam(raw.inStock),
    sort: firstParam(raw.sort),
    page: firstParam(raw.page),
    pageSize: firstParam(raw.pageSize),
  });

  return parsed.success ? parsed.data : DEFAULT_CATALOG_FILTERS;
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { locale: rawLocale } = await params;
  const raw = await searchParams;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  let filters = parseCatalogFilters(raw);
  const dictionary = getDictionary(rawLocale);
  const [currency, user] = await Promise.all([
    getSelectedCurrency(),
    getCurrentUser(),
  ]);
  const rateQuote = await getCheckoutRateSnapshot(currency);

  let catalog = await listCatalogProducts(rawLocale, filters, currency);
  const totalPages = Math.max(1, Math.ceil(catalog.total / catalog.pageSize));

  if (filters.page > totalPages) {
    filters = { ...filters, page: totalPages };
    catalog = await listCatalogProducts(rawLocale, filters, currency);
  }

  const { products, categories } = catalog;
  const [wishlistIds, formatPrice] = await Promise.all([
    getWishlistProductIds(products.map((p) => p.id)),
    createDisplayPriceFormatter(rawLocale, currency),
  ]);

  const priced = products.map((product) => {
    const price = formatPrice(product.priceAmount);
    const compareAt =
      product.compareAtAmount != null
        ? formatPrice(product.compareAtAmount)
        : null;

    return {
      product,
      price,
      compareAtFormatted: compareAt?.formatted ?? null,
    };
  });

  const categoryTitle =
    categories.find((entry) => entry.slug === filters.category)?.title ?? null;

  const priceBounds = buildCatalogPriceSliderBounds({
    currency,
    rate: rateQuote.rate,
    locale: rawLocale,
  });

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          {dictionary.nav.products}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[16.5rem_minmax(0,1fr)]">
        <CatalogFilters
          locale={rawLocale}
          filters={filters}
          categories={categories}
          priceBounds={priceBounds}
          copy={{
            searchLabel: dictionary.catalog.searchLabel,
            searchPlaceholder: dictionary.catalog.searchPlaceholder,
            priceLabel: dictionary.catalog.priceLabel,
            categoryLabel: dictionary.catalog.categoryLabel,
            allCategories: dictionary.catalog.allCategories,
            inStockLabel: dictionary.catalog.inStockLabel,
            inStockOnly: dictionary.catalog.inStockOnly,
            filtersTitle: dictionary.catalog.filtersTitle,
          }}
        />

        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-sm text-gray-600">
              {dictionary.catalog.resultsCount.replace(
                "{count}",
                String(catalog.total),
              )}
            </p>
            <CatalogSortSelect
              locale={rawLocale}
              filters={filters}
              copy={{
                sortLabel: dictionary.catalog.sortLabel,
                sortNewest: dictionary.catalog.sortNewest,
                sortPriceAsc: dictionary.catalog.sortPriceAsc,
                sortPriceDesc: dictionary.catalog.sortPriceDesc,
                sortPopular: dictionary.catalog.sortPopular,
              }}
            />
          </div>

          <CatalogActiveFilters
            locale={rawLocale}
            filters={filters}
            categoryTitle={categoryTitle}
            currencyCode={currency}
            removeFilterLabel={dictionary.catalog.removeFilter}
            labels={{
              search: dictionary.catalog.chipSearch,
              minPrice: dictionary.catalog.chipMinPrice,
              maxPrice: dictionary.catalog.chipMaxPrice,
              category: dictionary.catalog.chipCategory,
              inStock: dictionary.catalog.chipInStock,
              outOfStock: dictionary.catalog.outOfStock,
            }}
          />

          {priced.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gray-200 px-4 py-12 text-center text-gray-600">
              {dictionary.catalog.empty}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-6 xl:grid-cols-3">
              {priced.map(({ product, price, compareAtFormatted }, index) => (
                <ProductCard
                  key={product.id}
                  href={`/${rawLocale}/products/${product.translation.slug}`}
                  title={product.translation.title}
                  priceFormatted={price.formatted}
                  compareAtFormatted={compareAtFormatted}
                  discountPercent={product.discountPercent}
                  imageUrl={product.imageUrl}
                  inStock={product.stockOnHand > 0}
                  categoryLabel={product.category?.title ?? null}
                  specsSummary={product.specsSummary}
                  badgeLabel={product.badgeLabel}
                  priority={index < 4}
                  locale={rawLocale}
                  productId={product.id}
                  inWishlist={wishlistIds.has(product.id)}
                  isSignedIn={Boolean(user)}
                  wishlistLabel={dictionary.nav.wishlist}
                  addToCartLabel={dictionary.product.addToCart}
                  outOfStockLabel={dictionary.catalog.outOfStock}
                />
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <nav
              aria-label={dictionary.catalog.paginationLabel}
              className="flex items-center justify-center gap-4"
            >
              {filters.page > 1 ? (
                <AppLink
                  href={catalogHref(rawLocale, filters, {
                    page: filters.page - 1,
                  })}
                  prefetchPolicy="intent"
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {dictionary.catalog.previousPage}
                </AppLink>
              ) : (
                <span className="rounded-lg border border-transparent px-4 py-2 text-sm text-gray-300">
                  {dictionary.catalog.previousPage}
                </span>
              )}
              <span className="text-sm text-gray-600">
                {dictionary.catalog.pageStatus
                  .replace("{page}", String(filters.page))
                  .replace("{total}", String(totalPages))}
              </span>
              {filters.page < totalPages ? (
                <AppLink
                  href={catalogHref(rawLocale, filters, {
                    page: filters.page + 1,
                  })}
                  prefetchPolicy="intent"
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {dictionary.catalog.nextPage}
                </AppLink>
              ) : (
                <span className="rounded-lg border border-transparent px-4 py-2 text-sm text-gray-300">
                  {dictionary.catalog.nextPage}
                </span>
              )}
            </nav>
          ) : null}
        </div>
      </div>
    </section>
  );
}
