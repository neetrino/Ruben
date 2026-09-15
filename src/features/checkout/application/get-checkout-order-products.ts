import "server-only";

import { cartItems, products } from "@/db/schema";
import type { CheckoutOrderProduct } from "@/features/checkout/ui/checkout-order-product";
import { getPrimaryProductImageUrls } from "@/features/products/application/primary-product-images";
import type { ResolvedCatalogPrice } from "@/features/promotions/domain/resolve-automatic-discount";
import type { Locale } from "@/lib/i18n/config";

export type { CheckoutOrderProduct };

type CartItemWithProduct = {
  item: typeof cartItems.$inferSelect;
  product: typeof products.$inferSelect;
};

/** Builds checkout “products in your order” display rows from cart lines. */
export async function getCheckoutOrderProducts(
  locale: Locale,
  rows: CartItemWithProduct[],
  prices: ReadonlyMap<string, ResolvedCatalogPrice>,
): Promise<CheckoutOrderProduct[]> {
  const images = await getPrimaryProductImageUrls(
    rows.map(({ product }) => product.id),
  );

  return rows.map(({ item, product }) => {
    const translation =
      product.translations[locale] ?? product.translations.hy;
    const unitAmount =
      prices.get(product.id)?.unitAmount ?? product.priceAmount;
    return {
      id: item.id,
      title: translation?.title ?? product.sku,
      quantity: item.quantity,
      imageUrl: images.get(product.id) ?? null,
      lineTotalAmount: item.quantity * unitAmount,
    };
  });
}
