import { sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import {
  createdAtColumn,
  deletedAtColumn,
  idColumn,
  updatedAtColumn,
} from "@/db/schema/columns";
import {
  categoryStatusEnum,
  productAttributeTypeEnum,
  productStatusEnum,
} from "@/db/schema/enums";

export type LocaleTranslation = {
  title: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type TranslationsJson = Partial<
  Record<"hy" | "en" | "ru", LocaleTranslation>
>;

export const products = pgTable(
  "products",
  {
    id: idColumn(),
    sku: text("sku").notNull(),
    translations: jsonb("translations").$type<TranslationsJson>().notNull(),
    priceAmount: integer("price_amount").notNull(),
    compareAtAmount: integer("compare_at_amount"),
    stockOnHand: integer("stock_on_hand").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
    version: integer("version").notNull().default(0),
    status: productStatusEnum("status").notNull().default("DRAFT"),
    isFeatured: boolean("is_featured").notNull().default(false),
    isUpcoming: boolean("is_upcoming").notNull().default(false),
    badgeTranslations: jsonb("badge_translations").$type<
      Partial<Record<"hy" | "en" | "ru", string>>
    >(),
    badgeStyle: text("badge_style"),
    badgePosition: text("badge_position"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    deletedAt: deletedAtColumn(),
  },
  (table) => [
    uniqueIndex("products_sku_uidx").on(table.sku),
    index("products_status_created_idx").on(table.status, table.createdAt),
    index("products_stock_idx").on(table.stockOnHand),
    uniqueIndex("products_slug_hy_uidx")
      .on(sql`(${table.translations}->'hy'->>'slug')`)
      .where(sql`${table.translations}->'hy'->>'slug' IS NOT NULL`),
    uniqueIndex("products_slug_en_uidx")
      .on(sql`(${table.translations}->'en'->>'slug')`)
      .where(sql`${table.translations}->'en'->>'slug' IS NOT NULL`),
    uniqueIndex("products_slug_ru_uidx")
      .on(sql`(${table.translations}->'ru'->>'slug')`)
      .where(sql`${table.translations}->'ru'->>'slug' IS NOT NULL`),
    check("products_price_nonneg_chk", sql`${table.priceAmount} >= 0`),
    check(
      "products_compare_nonneg_chk",
      sql`${table.compareAtAmount} IS NULL OR ${table.compareAtAmount} >= 0`,
    ),
    check("products_stock_nonneg_chk", sql`${table.stockOnHand} >= 0`),
  ],
);

export const categories = pgTable(
  "categories",
  {
    id: idColumn(),
    parentId: uuid("parent_id").references((): AnyPgColumn => categories.id, {
      onDelete: "restrict",
    }),
    translations: jsonb("translations").$type<TranslationsJson>().notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    status: categoryStatusEnum("status").notNull().default("ACTIVE"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    deletedAt: deletedAtColumn(),
  },
  (table) => [
    index("categories_parent_idx").on(table.parentId),
    index("categories_status_sort_idx").on(table.status, table.sortOrder),
    uniqueIndex("categories_slug_hy_uidx")
      .on(sql`(${table.translations}->'hy'->>'slug')`)
      .where(sql`${table.translations}->'hy'->>'slug' IS NOT NULL`),
    uniqueIndex("categories_slug_en_uidx")
      .on(sql`(${table.translations}->'en'->>'slug')`)
      .where(sql`${table.translations}->'en'->>'slug' IS NOT NULL`),
    uniqueIndex("categories_slug_ru_uidx")
      .on(sql`(${table.translations}->'ru'->>'slug')`)
      .where(sql`${table.translations}->'ru'->>'slug' IS NOT NULL`),
  ],
);

export const productCategories = pgTable(
  "product_categories",
  {
    id: idColumn(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    isPrimary: boolean("is_primary").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: createdAtColumn(),
  },
  (table) => [
    uniqueIndex("product_categories_uidx").on(
      table.productId,
      table.categoryId,
    ),
    index("product_categories_category_idx").on(table.categoryId),
    uniqueIndex("product_categories_primary_uidx")
      .on(table.productId)
      .where(sql`${table.isPrimary} = true`),
  ],
);

/** Partner / manufacturer brands (admin CMS + storefront brands page). */
export const brands = pgTable(
  "brands",
  {
    id: idColumn(),
    translations: jsonb("translations").$type<TranslationsJson>().notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    status: categoryStatusEnum("status").notNull().default("ACTIVE"),
    /** When true, brand can appear in the home partners strip (max 5). */
    isFeatured: boolean("is_featured").notNull().default(false),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    deletedAt: deletedAtColumn(),
  },
  (table) => [
    index("brands_status_sort_idx").on(table.status, table.sortOrder),
    index("brands_featured_sort_idx").on(table.isFeatured, table.sortOrder),
    uniqueIndex("brands_slug_hy_uidx")
      .on(sql`(${table.translations}->'hy'->>'slug')`)
      .where(sql`${table.translations}->'hy'->>'slug' IS NOT NULL`),
    uniqueIndex("brands_slug_en_uidx")
      .on(sql`(${table.translations}->'en'->>'slug')`)
      .where(sql`${table.translations}->'en'->>'slug' IS NOT NULL`),
    uniqueIndex("brands_slug_ru_uidx")
      .on(sql`(${table.translations}->'ru'->>'slug')`)
      .where(sql`${table.translations}->'ru'->>'slug' IS NOT NULL`),
  ],
);

/**
 * Global product attribute dictionary (Size, Color, …).
 * Product assignment / storefront filters are a later step.
 */
export const productAttributes = pgTable(
  "product_attributes",
  {
    id: idColumn(),
    code: text("code").notNull(),
    translations: jsonb("translations").$type<TranslationsJson>().notNull(),
    type: productAttributeTypeEnum("type").notNull().default("TEXT"),
    isFilterable: boolean("is_filterable").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    status: categoryStatusEnum("status").notNull().default("ACTIVE"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    deletedAt: deletedAtColumn(),
  },
  (table) => [
    index("product_attributes_status_sort_idx").on(
      table.status,
      table.sortOrder,
    ),
    uniqueIndex("product_attributes_code_uidx")
      .on(table.code)
      .where(sql`${table.deletedAt} IS NULL`),
  ],
);

/** Allowed values for a global product attribute (e.g. XL, #FF0000). */
export const productAttributeValues = pgTable(
  "product_attribute_values",
  {
    id: idColumn(),
    attributeId: uuid("attribute_id")
      .notNull()
      .references(() => productAttributes.id, { onDelete: "restrict" }),
    code: text("code").notNull(),
    translations: jsonb("translations").$type<TranslationsJson>().notNull(),
    /** Present for COLOR attributes; null for TEXT. */
    swatchHex: text("swatch_hex"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    deletedAt: deletedAtColumn(),
  },
  (table) => [
    index("product_attribute_values_attribute_idx").on(table.attributeId),
    uniqueIndex("product_attribute_values_code_uidx")
      .on(table.attributeId, table.code)
      .where(sql`${table.deletedAt} IS NULL`),
    check(
      "product_attribute_values_swatch_hex_chk",
      sql`${table.swatchHex} IS NULL OR ${table.swatchHex} ~ '^#[0-9A-Fa-f]{6}$'`,
    ),
  ],
);

/** Product ↔ attribute value assignments for catalog filters. */
export const productAttributeAssignments = pgTable(
  "product_attribute_assignments",
  {
    id: idColumn(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    attributeValueId: uuid("attribute_value_id")
      .notNull()
      .references(() => productAttributeValues.id, { onDelete: "restrict" }),
    createdAt: createdAtColumn(),
  },
  (table) => [
    uniqueIndex("product_attribute_assignments_uidx").on(
      table.productId,
      table.attributeValueId,
    ),
    index("product_attribute_assignments_value_idx").on(table.attributeValueId),
  ],
);
