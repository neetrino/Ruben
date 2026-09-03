import { HomeProductCard } from "@/features/home/ui/HomeProductCard";
import { HomeSectionHeader } from "@/features/home/ui/HomeSectionHeader";
import type { Locale } from "@/lib/i18n/config";

type PromoProduct = {
  id: string;
  href: string;
  title: string;
  brandLabel?: string | null;
  priceFormatted: string;
  compareAtFormatted?: string | null;
  discountPercent?: number | null;
  badgeLabel?: string | null;
  imageUrl: string | null;
  inStock: boolean;
  inWishlist?: boolean;
  inCompare?: boolean;
};

type HomePromotionsProps = {
  locale: Locale;
  title: string;
  viewAllLabel: string;
  viewAllHref: string;
  emptyLabel: string;
  globalDiscountLabel: string | null;
  wishlistLabel: string;
  compareLabel: string;
  compareLimitLabel: string;
  addToCartLabel: string;
  isSignedIn: boolean;
  products: readonly PromoProduct[];
};

export function HomePromotions({
  locale,
  title,
  viewAllLabel,
  viewAllHref,
  emptyLabel,
  globalDiscountLabel,
  wishlistLabel,
  compareLabel,
  compareLimitLabel,
  addToCartLabel,
  isSignedIn,
  products,
}: HomePromotionsProps) {
  return (
    <section
      id="promotions"
      className="scroll-mt-28 bg-white py-8 pb-28 sm:py-16 lg:py-20 lg:pb-20"
    >
      <div className="mx-auto max-w-[1440px] px-[15px] sm:px-10 lg:px-[51px]">
        <HomeSectionHeader
          title={title}
          viewAllLabel={viewAllLabel}
          viewAllHref={viewAllHref}
        />

        {globalDiscountLabel ? (
          <p className="mb-8 hidden rounded-full bg-black px-4 py-3 text-center text-sm font-semibold text-white sm:text-base lg:block">
            {globalDiscountLabel}
          </p>
        ) : null}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className={index >= 2 ? "hidden lg:block" : undefined}
              >
                <HomeProductCard
                  href={product.href}
                  title={product.title}
                  brandLabel={product.brandLabel}
                  priceFormatted={product.priceFormatted}
                  compareAtFormatted={product.compareAtFormatted}
                  discountPercent={product.discountPercent}
                  badgeLabel={product.badgeLabel}
                  imageUrl={product.imageUrl}
                  inStock={product.inStock}
                  priority={index < 4}
                  locale={locale}
                  productId={product.id}
                  inWishlist={product.inWishlist ?? false}
                  inCompare={product.inCompare ?? false}
                  isSignedIn={isSignedIn}
                  wishlistLabel={wishlistLabel}
                  compareLabel={compareLabel}
                  compareLimitLabel={compareLimitLabel}
                  addToCartLabel={addToCartLabel}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-600">{emptyLabel}</p>
        )}
      </div>
    </section>
  );
}
