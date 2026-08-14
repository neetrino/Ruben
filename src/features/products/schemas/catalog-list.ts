import { z } from "zod";

export const CATALOG_SORT_VALUES = [
  "newest",
  "price_asc",
  "price_desc",
  "popular",
] as const;

export type CatalogSort = (typeof CATALOG_SORT_VALUES)[number];

export const CATALOG_PAGE_SIZES = [12, 24, 48] as const;

export type CatalogPageSize = (typeof CATALOG_PAGE_SIZES)[number];

export const DEFAULT_CATALOG_PAGE_SIZE: CatalogPageSize = 24;

function emptyToUndefined(value: unknown): unknown {
  if (value == null) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
}

export const catalogListFilterSchema = z
  .object({
    q: z.preprocess(
      emptyToUndefined,
      z.string().trim().max(100).optional(),
    ),
    minPrice: z.preprocess(
      emptyToUndefined,
      z.coerce.number().int().nonnegative().optional(),
    ),
    maxPrice: z.preprocess(
      emptyToUndefined,
      z.coerce.number().int().nonnegative().optional(),
    ),
    category: z.preprocess(
      emptyToUndefined,
      z.string().trim().max(120).optional(),
    ),
    inStock: z.preprocess(emptyToUndefined, z.enum(["true", "false"]).optional()),
    sort: z.preprocess(
      emptyToUndefined,
      z.enum(CATALOG_SORT_VALUES).optional(),
    ),
    page: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).max(500).optional()),
    pageSize: z.preprocess(
      emptyToUndefined,
      z.coerce
        .number()
        .int()
        .refine((value): value is CatalogPageSize =>
          (CATALOG_PAGE_SIZES as readonly number[]).includes(value),
        )
        .optional(),
    ),
  })
  .transform((raw) => {
    const inStock =
      raw.inStock === "true"
        ? true
        : raw.inStock === "false"
          ? false
          : undefined;

    return {
      q: raw.q,
      minPrice: raw.minPrice,
      maxPrice: raw.maxPrice,
      category: raw.category,
      inStock,
      sort: raw.sort ?? ("newest" as const),
      page: raw.page ?? 1,
      pageSize: raw.pageSize ?? DEFAULT_CATALOG_PAGE_SIZE,
    };
  })
  .superRefine((data, ctx) => {
    if (
      data.minPrice != null &&
      data.maxPrice != null &&
      data.maxPrice < data.minPrice
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["maxPrice"],
        message: "maxPrice must be greater than or equal to minPrice",
      });
    }
  });

export type CatalogListFilter = z.infer<typeof catalogListFilterSchema>;

/** Safe defaults when raw URL params fail validation. */
export const DEFAULT_CATALOG_FILTERS: CatalogListFilter = {
  q: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  category: undefined,
  inStock: undefined,
  sort: "newest",
  page: 1,
  pageSize: DEFAULT_CATALOG_PAGE_SIZE,
};
