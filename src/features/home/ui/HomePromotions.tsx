import { AppLink } from "@/components/ui/AppLink";
import { ProductCard } from "@/features/products/ui/ProductCard";
import type { Locale } from "@/lib/i18n/config";

type PromoProduct = {
  id: string;
  href: string;
  title: string;
  priceFormatted: string;
  compareAtFormatted?: string | null;
  discountPercent?: number | null;
  imageUrl: string | null;
  inStock: boolean;
  inWishlist?: boolean;
};

type OfferCard = {
  title: string;
  description: string;
  href: string;
};

type HomePromotionsProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  viewAllLabel: string;
  viewAllHref: string;
  emptyLabel: string;
  globalDiscountLabel: string | null;
  wishlistLabel: string;
  addToCartLabel: string;
  isSignedIn: boolean;
  products: readonly PromoProduct[];
  offers: readonly OfferCard[];
};

export function HomePromotions({
  locale,
  title,
  subtitle,
  viewAllLabel,
  viewAllHref,
  emptyLabel,
  globalDiscountLabel,
  wishlistLabel,
  addToCartLabel,
  isSignedIn,
  products,
  offers,
}: HomePromotionsProps) {
  const hasProducts = products.length > 0;

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              {title}
            </h2>
            <p className="mt-2 text-base text-gray-600">{subtitle}</p>
          </div>
          <AppLink
            href={viewAllHref}
            prefetchPolicy="intent"
            className="text-sm font-semibold text-gray-700 underline-offset-2 hover:underline"
          >
            {viewAllLabel}
          </AppLink>
        </div>

        {globalDiscountLabel ? (
          <p className="mb-8 rounded-lg bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white sm:text-base">
            {globalDiscountLabel}
          </p>
        ) : null}

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {offers.map((offer) => (
            <AppLink
              key={offer.title}
              href={offer.href}
              prefetchPolicy="intent"
              className="block border border-gray-200 bg-gray-50 p-5 transition hover:border-gray-300 hover:bg-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {offer.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {offer.description}
              </p>
            </AppLink>
          ))}
        </div>

        {hasProducts ? (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                href={product.href}
                title={product.title}
                priceFormatted={product.priceFormatted}
                compareAtFormatted={product.compareAtFormatted}
                discountPercent={product.discountPercent}
                imageUrl={product.imageUrl}
                inStock={product.inStock}
                priority={index < 4}
                locale={locale}
                productId={product.id}
                inWishlist={product.inWishlist ?? false}
                isSignedIn={isSignedIn}
                wishlistLabel={wishlistLabel}
                addToCartLabel={addToCartLabel}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">{emptyLabel}</p>
        )}
      </div>
    </section>
  );
}
