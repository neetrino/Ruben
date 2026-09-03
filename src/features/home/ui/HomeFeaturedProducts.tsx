import { HomeProductCard } from "@/features/home/ui/HomeProductCard";
import { HomeSectionHeader } from "@/features/home/ui/HomeSectionHeader";
import type { Locale } from "@/lib/i18n/config";

type FeaturedItem = {
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

type HomeFeaturedProductsProps = {
  locale: Locale;
  title: string;
  viewAllLabel: string;
  viewAllHref: string;
  emptyLabel: string;
  wishlistLabel: string;
  compareLabel: string;
  compareLimitLabel: string;
  addToCartLabel: string;
  isSignedIn: boolean;
  products: readonly FeaturedItem[];
  roundedTop?: boolean;
};

export function HomeFeaturedProducts({
  locale,
  title,
  viewAllLabel,
  viewAllHref,
  emptyLabel,
  wishlistLabel,
  compareLabel,
  compareLimitLabel,
  addToCartLabel,
  isSignedIn,
  products,
  roundedTop = true,
}: HomeFeaturedProductsProps) {
  return (
    <section
      className={`bg-white py-8 sm:py-16 lg:py-20 ${
        roundedTop ? "lg:rounded-t-[40px]" : ""
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-[13px] sm:px-10 lg:px-[51px]">
        <HomeSectionHeader
          title={title}
          viewAllLabel={viewAllLabel}
          viewAllHref={viewAllHref}
        />

        {products.length === 0 ? (
          <p className="text-neutral-600">{emptyLabel}</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className={index >= 4 ? "hidden lg:block" : undefined}
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
        )}
      </div>
    </section>
  );
}
