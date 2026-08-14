import type {
  CatalogProduct,
  ProductCategoryRef,
} from "@/features/products/types";

export type CompareProduct = CatalogProduct & {
  categories: ProductCategoryRef[];
};
