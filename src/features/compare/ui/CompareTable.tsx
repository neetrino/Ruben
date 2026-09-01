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

function CellValue({ children }: { children: React.ReactNode }) {
  return (
    <td className="min-w-[10rem] border-b border-gray-100 px-4 py-3 align-top text-sm text-gray-800 sm:min-w-[11rem]">
      {children}
    </td>
  );
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <th
      scope="row"
      className="sticky left-0 z-10 w-36 border-b border-gray-100 bg-white px-4 py-3 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
    >
      {children}
    </th>
  );
}

export function CompareTable({ locale, items, labels }: CompareTableProps) {
  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <table className="w-full min-w-max border-collapse text-left">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-20 w-36 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-900"
            >
              {labels.product}
            </th>
            {items.map(({ product }) => (
              <th
                key={product.id}
                scope="col"
                className="min-w-[10rem] px-4 py-3 sm:min-w-[11rem]"
              >
                <div className="relative flex flex-col gap-3">
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
                  <AddToCartButton
                    productId={product.id}
                    label={labels.addToCart}
                    disabled={product.stockOnHand < 1}
                    size="md"
                    imageUrl={product.imageUrl}
                    className="h-10 w-10 self-start rounded-full border border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <RowLabel>{labels.price}</RowLabel>
            {items.map(({ product, priceFormatted }) => (
              <CellValue key={`${product.id}-price`}>
                <span className="text-base font-semibold text-gray-900">
                  {priceFormatted}
                </span>
              </CellValue>
            ))}
          </tr>
          <tr>
            <RowLabel>{labels.compareAt}</RowLabel>
            {items.map(({ product, compareAtFormatted }) => (
              <CellValue key={`${product.id}-compare-at`}>
                {compareAtFormatted ? (
                  <span className="text-gray-500 line-through">
                    {compareAtFormatted}
                  </span>
                ) : (
                  labels.emptyValue
                )}
              </CellValue>
            ))}
          </tr>
          <tr>
            <RowLabel>{labels.discount}</RowLabel>
            {items.map(({ product }) => (
              <CellValue key={`${product.id}-discount`}>
                {product.discountPercent != null ? (
                  <span className="font-medium text-red-600">
                    -{product.discountPercent}%
                  </span>
                ) : (
                  labels.emptyValue
                )}
              </CellValue>
            ))}
          </tr>
          <tr>
            <RowLabel>{labels.sku}</RowLabel>
            {items.map(({ product }) => (
              <CellValue key={`${product.id}-sku`}>{product.sku}</CellValue>
            ))}
          </tr>
          <tr>
            <RowLabel>{labels.availability}</RowLabel>
            {items.map(({ product }) => {
              const inStock = product.stockOnHand > 0;
              return (
                <CellValue key={`${product.id}-stock`}>
                  <span className={inStock ? "text-green-700" : "text-red-700"}>
                    {inStock ? labels.inStock : labels.outOfStock}
                  </span>
                </CellValue>
              );
            })}
          </tr>
          <tr>
            <RowLabel>{labels.categories}</RowLabel>
            {items.map(({ product }) => (
              <CellValue key={`${product.id}-categories`}>
                {product.categories.length > 0
                  ? product.categories
                      .map((category) => category.title)
                      .join(" · ")
                  : labels.emptyValue}
              </CellValue>
            ))}
          </tr>
          <tr>
            <RowLabel>{labels.description}</RowLabel>
            {items.map(({ product }) => (
              <CellValue key={`${product.id}-description`}>
                {product.translation.description ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                    {product.translation.description}
                  </p>
                ) : (
                  labels.emptyValue
                )}
              </CellValue>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
