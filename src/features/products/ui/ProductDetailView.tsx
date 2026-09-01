import { AppLink } from "@/components/ui/AppLink";
import { ProductDetailTabs } from "@/features/products/ui/ProductDetailTabs";
import { ProductGallery } from "@/features/products/ui/ProductGallery";
import { ProductPurchaseControls } from "@/features/products/ui/ProductPurchaseControls";
import type { ProductDetail } from "@/features/products/types";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type ProductDetailViewProps = {
  locale: Locale;
  product: ProductDetail;
  priceFormatted: string;
  compareAtFormatted: string | null;
  isSignedIn: boolean;
  inWishlist: boolean;
  inCompare: boolean;
  dictionary: Dictionary;
  jsonLd: Record<string, unknown>;
  relatedSlot: React.ReactNode;
};

function shortDescription(description: string | undefined): string | null {
  if (!description) return null;
  const first = description
    .split(/\n+/)
    .map((part) => part.trim())
    .find((part) => part.length > 0);
  if (!first) return null;
  if (first.length <= 280) return first;
  return `${first.slice(0, 277).trimEnd()}…`;
}

export function ProductDetailView({
  locale,
  product,
  priceFormatted,
  compareAtFormatted,
  isSignedIn,
  inWishlist,
  inCompare,
  dictionary,
  jsonLd,
  relatedSlot,
}: ProductDetailViewProps) {
  const labels = dictionary.product;
  const inStock = product.stockOnHand > 0;
  const primaryCategory = product.categories[0] ?? null;
  const brandLabel = primaryCategory?.title ?? null;
  const excerpt = shortDescription(product.translation.description);

  const metaRows: Array<{ label: string; value: string }> = [];
  if (primaryCategory) {
    metaRows.push({
      label: labels.categoryLabel,
      value: primaryCategory.title,
    });
  }

  const specs = [
    ...metaRows,
    {
      label: labels.stockLabel,
      value: inStock ? labels.inStock : labels.outOfStock,
    },
  ];

  return (
    <article className="product-page-root">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 px-6 pt-3 pb-2 text-sm sm:px-10 lg:px-12"
      >
        <AppLink
          href={`/${locale}`}
          prefetchPolicy="intent"
          className="text-[#888] hover:text-black"
        >
          {dictionary.catalog.breadcrumbHome}
        </AppLink>
        <span className="text-[#bbb]" aria-hidden>
          /
        </span>
        <AppLink
          href={`/${locale}/products`}
          prefetchPolicy="intent"
          className="text-[#888] hover:text-black"
        >
          {labels.backToProducts}
        </AppLink>
        <span className="text-[#bbb]" aria-hidden>
          /
        </span>
        <span className="font-semibold text-black">
          {product.translation.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 gap-10 px-6 py-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10 lg:px-12">
        <ProductGallery
          images={product.images}
          title={product.translation.title}
          discountPercent={product.discountPercent}
          badgeLabel={product.badgeLabel}
          inStock={inStock}
          outOfStockLabel={labels.outOfStock}
        />

        <div className="flex flex-col gap-5">
          {brandLabel ? (
            <p className="text-[11px] leading-[16.5px] tracking-[1px] text-[#4c4546] uppercase">
              {brandLabel}
            </p>
          ) : null}

          <h1 className="text-[28px] leading-10 font-bold tracking-[0.5px] text-black uppercase sm:text-[32px]">
            {product.translation.title}
          </h1>

          {excerpt ? (
            <p className="text-[15px] leading-[25.5px] text-[#555]">{excerpt}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-4">
            <p className="text-[32px] leading-8 font-black text-black">
              {priceFormatted}
            </p>
            {compareAtFormatted ? (
              <p className="pb-1 text-lg leading-[18px] text-black/50 line-through">
                {compareAtFormatted}
              </p>
            ) : null}
            {product.discountPercent != null ? (
              <span className="inline-flex rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-bold text-black">
                −{product.discountPercent}%
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`size-2.5 rounded-full ${
                inStock ? "bg-[#00c950]" : "bg-neutral-400"
              }`}
              aria-hidden
            />
            <span
              className={`text-sm font-semibold ${
                inStock ? "text-[#00a63e]" : "text-neutral-500"
              }`}
            >
              {inStock ? labels.inStock : labels.outOfStock}
            </span>
          </div>

          <ProductPurchaseControls
            locale={locale}
            productId={product.id}
            stockOnHand={product.stockOnHand}
            inWishlist={inWishlist}
            inCompare={inCompare}
            isSignedIn={isSignedIn}
            wishlistLabel={dictionary.nav.wishlist}
            compareLabel={dictionary.nav.compare}
            compareLimitLabel={dictionary.compare.limitReached}
            imageUrl={product.images[0]?.url ?? product.imageUrl}
            labels={{
              quantity: labels.quantity,
              decreaseQuantity: dictionary.cartDrawer.decreaseQuantity,
              increaseQuantity: dictionary.cartDrawer.increaseQuantity,
              addToCart: labels.addToCart,
              adding: labels.adding,
              outOfStock: labels.outOfStock,
              error: labels.addError,
            }}
          />

          {metaRows.length > 0 ? (
            <div className="border-t border-[#f0f0f0] pt-4">
              <dl className="flex flex-col gap-2">
                {metaRows.map((row) => (
                  <div key={row.label} className="flex gap-3 text-[13px] leading-[19.5px]">
                    <dt className="w-28 shrink-0 text-[#888]">{row.label}</dt>
                    <dd className="font-semibold text-[#212121]">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </div>

      <div className="px-6 lg:px-12">
        <ProductDetailTabs
          descriptionLabel={labels.tabDescription}
          specsLabel={labels.tabSpecs}
          fullDescriptionTitle={labels.fullDescriptionTitle}
          specsTitle={labels.specsTitle}
          description={product.translation.description ?? null}
          specs={specs}
          emptyDescription={labels.emptyDescription}
          emptySpecs={labels.emptySpecs}
        />
      </div>

      <div className="px-6 pt-4 lg:px-12">{relatedSlot}</div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
