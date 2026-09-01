import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import { AddToCartButton } from "@/features/cart/ui/AddToCartButton";
import { RemoveFromCompareButton } from "@/features/compare/ui/RemoveFromCompareButton";
import type { CompareProduct } from "@/features/compare/types";
import type { Locale } from "@/lib/i18n/config";

type CompareRowLabels = {
  product: string;
  price: string;
  compareAt: string;
  discount: string;
  sku: string;
  availability: string;
  categories: string;
  description: string;
  inStock: string;
  outOfStock: string;
  remove: string;
  addToCart: string;
  emptyValue: string;
};

type PricedCompareProduct = {
  product: CompareProduct;
  priceFormatted: string;
  compareAtFormatted: string | null;
};

type CompareTableProps = {
  locale: Locale;
  items: readonly PricedCompareProduct[];
  labels: CompareRowLabels;
};

function ProductCell({
  children,
  isLast = false,
  compactTop = false,
}: {
  children: React.ReactNode;
  isLast?: boolean;
  compactTop?: boolean;
}) {
  return (
    <td
      className={`min-w-[10rem] border-b border-[#e8e8e8] px-4 align-top text-sm text-gray-800 sm:min-w-[11rem] ${
        compactTop ? "pt-1 pb-3" : "py-3"
      } ${isLast ? "" : "border-r border-[#e8e8e8]"}`}
    >
      {children}
    </td>
  );
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <th
      scope="row"
      className="sticky left-0 z-10 w-36 border-r border-b border-[#e8e8e8] bg-white px-4 py-3 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
    >
      {children}
    </th>
  );
}

export function CompareTable({ locale, items, labels }: CompareTableProps) {
  return (
    <div className="-mx-4 overflow-x-auto [scrollbar-width:none] sm:mx-0 [&::-webkit-scrollbar]:hidden">
      <div className="inline-block min-w-full overflow-hidden rounded-[15px] border border-[#e8e8e8]">
        <table className="w-full min-w-max border-collapse text-left">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-20 w-36 border-r border-[#e8e8e8] bg-white px-4 py-3 text-left text-sm font-semibold text-gray-900"
            >
              {labels.product}
            </th>
            {items.map(({ product }) => (
              <th
                key={product.id}
                scope="col"
                className="min-w-[10rem] border-r border-[#e8e8e8] px-4 pt-3 pb-1 last:border-r-0 sm:min-w-[11rem]"
              >
                <div className="relative flex flex-col gap-2">
                  <RemoveFromCompareButton
                    productId={product.id}
                    label={labels.remove}
                    className="absolute top-0 right-0 z-10 h-8 w-8 bg-white/95 text-gray-700 shadow-sm hover:bg-white"
                  />
                  <AppLink
                    href={`/${locale}/products/${product.translation.slug}`}
                    prefetchPolicy="intent"
                    className="relative mx-auto block size-28 overflow-hidden rounded-2xl bg-[#eaeaea] sm:size-32"
                  >
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.translation.title}
                        fill
                        sizes="128px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        {labels.emptyValue}
                      </div>
                    )}
                  </AppLink>
                  <AppLink
                    href={`/${locale}/products/${product.translation.slug}`}
                    prefetchPolicy="intent"
                    className="line-clamp-2 pr-8 text-sm font-medium text-gray-900 hover:underline"
                  >
                    {product.translation.title}
                  </AppLink>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <RowLabel>{labels.price}</RowLabel>
            {items.map(({ product, priceFormatted }, index) => (
              <ProductCell
                key={`${product.id}-price`}
                isLast={index === items.length - 1}
                compactTop
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-base font-semibold text-gray-900">
                    {priceFormatted}
                  </span>
                  <AddToCartButton
                    productId={product.id}
                    label={labels.addToCart}
                    disabled={product.stockOnHand < 1}
                    size="md"
                    imageUrl={product.imageUrl}
                    className="h-10 w-10 shrink-0 rounded-full border border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                  />
                </div>
              </ProductCell>
            ))}
          </tr>
          <tr>
            <RowLabel>{labels.compareAt}</RowLabel>
            {items.map(({ product, compareAtFormatted }, index) => (
              <ProductCell key={`${product.id}-compare-at`} isLast={index === items.length - 1}>
                {compareAtFormatted ? (
                  <span className="text-gray-500 line-through">
                    {compareAtFormatted}
                  </span>
                ) : (
                  labels.emptyValue
                )}
              </ProductCell>
            ))}
          </tr>
          <tr>
            <RowLabel>{labels.discount}</RowLabel>
            {items.map(({ product }, index) => (
              <ProductCell key={`${product.id}-discount`} isLast={index === items.length - 1}>
                {product.discountPercent != null ? (
                  <span className="font-medium text-red-600">
                    -{product.discountPercent}%
                  </span>
                ) : (
                  labels.emptyValue
                )}
              </ProductCell>
            ))}
          </tr>
          <tr>
            <RowLabel>{labels.sku}</RowLabel>
            {items.map(({ product }, index) => (
              <ProductCell key={`${product.id}-sku`} isLast={index === items.length - 1}>
                {product.sku}
              </ProductCell>
            ))}
          </tr>
          <tr>
            <RowLabel>{labels.availability}</RowLabel>
            {items.map(({ product }, index) => {
              const inStock = product.stockOnHand > 0;
              return (
                <ProductCell key={`${product.id}-stock`} isLast={index === items.length - 1}>
                  <span className={inStock ? "text-green-700" : "text-red-700"}>
                    {inStock ? labels.inStock : labels.outOfStock}
                  </span>
                </ProductCell>
              );
            })}
          </tr>
          <tr>
            <RowLabel>{labels.categories}</RowLabel>
            {items.map(({ product }, index) => (
              <ProductCell key={`${product.id}-categories`} isLast={index === items.length - 1}>
                {product.categories.length > 0
                  ? product.categories
                      .map((category) => category.title)
                      .join(" · ")
                  : labels.emptyValue}
              </ProductCell>
            ))}
          </tr>
          <tr>
            <RowLabel>{labels.description}</RowLabel>
            {items.map(({ product }, index) => (
              <ProductCell key={`${product.id}-description`} isLast={index === items.length - 1}>
                {product.translation.description ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                    {product.translation.description}
                  </p>
                ) : (
                  labels.emptyValue
                )}
              </ProductCell>
            ))}
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );
}
