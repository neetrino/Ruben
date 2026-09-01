import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AppLink } from "@/components/ui/AppLink";
import { listCatalogProducts } from "@/features/products/application/list-catalog-products";
import { buildCatalogPriceSliderBounds } from "@/features/products/domain/catalog-price-ranges";
import {
  catalogListFilterSchema,
  DEFAULT_CATALOG_FILTERS,
  type CatalogListFilter,
} from "@/features/products/schemas/catalog-list";
import { CatalogActiveFilters } from "@/features/products/ui/CatalogActiveFilters";
import { CatalogCategoryChips } from "@/features/products/ui/CatalogCategoryChips";
import { CatalogFilters } from "@/features/products/ui/CatalogFilters";
import { CatalogPagination } from "@/features/products/ui/CatalogPagination";
import { CatalogSortPills } from "@/features/products/ui/CatalogSortPills";
import { ProductCard } from "@/features/products/ui/ProductCard";
import { getCompareProductIds } from "@/features/compare/queries";
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
    pageSize: firstParam(raw.pageSize) ?? "12",
  });

  return parsed.success ? parsed.data : { ...DEFAULT_CATALOG_FILTERS, pageSize: 12 };
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
  const [wishlistIds, compareIds, formatPrice] = await Promise.all([
    getWishlistProductIds(products.map((p) => p.id)),
    getCompareProductIds(products.map((p) => p.id)),
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

  const resultsLabel = dictionary.catalog.resultsCount.replace(
    "{count}",
    String(catalog.total),
  );

  const showingNodes: ReactNode[] = [];
  for (const [index, part] of dictionary.catalog.showingCount
    .split("{count}")
    .entries()) {
    if (index > 0) {
      showingNodes.push(
        <span key={`count-${index}`} className="font-bold text-black">
          {priced.length}
        </span>,
      );
    }
    if (part.length > 0) {
      showingNodes.push(<span key={`text-${index}`}>{part}</span>);
    }
  }

  return (
    <div className="shop-page-root">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 px-6 pt-4 pb-6 text-sm sm:px-10 lg:px-12 lg:pb-8"
      >
        <AppLink
          href={`/${rawLocale}`}
          prefetchPolicy="intent"
          className="text-[#888] hover:text-black"
        >
          {dictionary.catalog.breadcrumbHome}
        </AppLink>
        <span className="text-[#bbb]" aria-hidden>
          /
        </span>
        <span className="font-semibold text-black">
          {dictionary.catalog.breadcrumbShop}
        </span>
      </nav>

      <div className="pb-10 lg:pb-14">
        <CatalogCategoryChips
          locale={rawLocale}
          filters={filters}
          categories={categories}
          allLabel={dictionary.catalog.allChip}
        />
      </div>

      <div className="px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <div>
            <h1 className="flex h-[42px] items-center text-[28px] leading-none font-black tracking-[0.7px] text-black uppercase">
              {dictionary.catalog.shopTitle}
            </h1>
            <p className="mt-1 text-sm leading-5 text-[#888]">{resultsLabel}</p>
          </div>

          <div className="flex min-h-[42px] min-w-0 flex-col justify-center gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-none text-[#888]">{showingNodes}</p>
            <CatalogSortPills
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

          <div className="lg:sticky lg:top-28 lg:self-start">
            <CatalogFilters
              locale={rawLocale}
              filters={filters}
              categories={categories}
              priceBounds={priceBounds}
              totalCount={catalog.total}
              copy={{
                brandLabel: dictionary.catalog.brandLabel,
                priceLabel: dictionary.catalog.priceLabel,
                priceFromLabel: dictionary.catalog.priceFromLabel,
                priceToLabel: dictionary.catalog.priceToLabel,
                categoryLabel: dictionary.catalog.categoryLabel,
                allCategories: dictionary.catalog.allCategories,
                featuresLabel: dictionary.catalog.featuresLabel,
                moreLabel: dictionary.catalog.moreLabel,
                lessLabel: dictionary.catalog.lessLabel,
                filtersTitle: dictionary.catalog.filtersTitle,
              }}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-8">
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
              <p className="rounded-[24px] border border-dashed border-neutral-200 px-4 py-16 text-center text-[#888]">
                {dictionary.catalog.empty}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-x-[30px] gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
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
                    badgeLabel={product.badgeLabel}
                    priority={index < 4}
                    locale={rawLocale}
                    productId={product.id}
                    inWishlist={wishlistIds.has(product.id)}
                    inCompare={compareIds.has(product.id)}
                    isSignedIn={Boolean(user)}
                    wishlistLabel={dictionary.nav.wishlist}
                    compareLabel={dictionary.nav.compare}
                    compareLimitLabel={dictionary.compare.limitReached}
                    addToCartLabel={dictionary.product.addToCart}
                    outOfStockLabel={dictionary.catalog.outOfStock}
                  />
                ))}
              </div>
            )}

            <CatalogPagination
              locale={rawLocale}
              filters={filters}
              totalPages={totalPages}
              paginationLabel={dictionary.catalog.paginationLabel}
              previousLabel={dictionary.catalog.previousPage}
              nextLabel={dictionary.catalog.nextPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
