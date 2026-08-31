import { HomeArrowCta } from "@/features/home/ui/HomeArrowCta";
import { HomeProductCard } from "@/features/home/ui/HomeProductCard";
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
    <section id="promotions" className="scroll-mt-28 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-[51px]">
        <div className="mb-10 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold tracking-wide text-black uppercase sm:text-2xl">
            {title}
          </h2>
          <HomeArrowCta href={viewAllHref} label={viewAllLabel} />
        </div>

        {globalDiscountLabel ? (
          <p className="mb-8 rounded-full bg-black px-4 py-3 text-center text-sm font-semibold text-white sm:text-base">
            {globalDiscountLabel}
          </p>
        ) : null}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product, index) => (
              <HomeProductCard
                key={product.id}
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
            ))}
          </div>
        ) : (
          <p className="text-neutral-600">{emptyLabel}</p>
        )}
      </div>
    </section>
  );
}
