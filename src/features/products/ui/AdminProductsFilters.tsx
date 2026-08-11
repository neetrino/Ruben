"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { ADMIN_LABEL } from "@/features/admin/ui/admin-form-classes";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import type { AdminCategoryOption } from "@/features/products/application/list-admin-products";

const FILTER_INPUT =
  "h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-300";

type AdminProductsFiltersProps = {
  locale: string;
  total: number;
  q?: string;
  sku?: string;
  categoryId?: string;
  stock: "all" | "in_stock" | "out_of_stock" | "low_stock";
  categories: AdminCategoryOption[];
  sort: string;
  dir: string;
};

export function AdminProductsFilters({
  locale,
  total,
  q,
  sku,
  categoryId,
  stock,
  categories,
  sort,
  dir,
}: AdminProductsFiltersProps) {
  const t = adminCopy(locale);
  const formRef = useRef<HTMLFormElement>(null);
  const [categoryValue, setCategoryValue] = useState(categoryId ?? "");
  const [stockValue, setStockValue] = useState(stock);

  const stockOptions = [
    { label: t.products.stock.all, value: "all" },
    { label: t.products.stock.inStock, value: "in_stock" },
    { label: t.products.stock.outOfStock, value: "out_of_stock" },
    { label: t.products.stock.lowStock, value: "low_stock" },
  ] as const;

  const categoryOptions = categories.map((category) => ({
    label: category.title,
    value: category.id,
  }));

  function applyCategory(next: string): void {
    flushSync(() => setCategoryValue(next));
    formRef.current?.requestSubmit();
  }

  function applyStock(next: string): void {
    flushSync(() =>
      setStockValue(next as AdminProductsFiltersProps["stock"]),
    );
    formRef.current?.requestSubmit();
  }

  return (
    <div className="mb-4">
      <p className="mb-3 text-sm text-gray-600">
        {t.products.total.replace("{count}", String(total))}
      </p>
      <form
        ref={formRef}
        method="get"
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <input type="hidden" name="sort" value={sort} />
        <input type="hidden" name="dir" value={dir} />
        <label>
          <span className={ADMIN_LABEL}>{t.products.search.titleSlug}</span>
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder={t.products.search.titleSlug}
            className={`${FILTER_INPUT} mt-1`}
            aria-label={t.products.search.titleSlug}
          />
        </label>
        <label>
          <span className={ADMIN_LABEL}>{t.products.search.sku}</span>
          <input
            name="sku"
            defaultValue={sku ?? ""}
            placeholder={t.products.search.sku}
            className={`${FILTER_INPUT} mt-1`}
            aria-label={t.products.search.sku}
          />
        </label>
        <div>
          <span className={ADMIN_LABEL}>{t.products.filter.category}</span>
          <SelectDropdown
            name="categoryId"
            ariaLabel={t.products.filter.category}
            value={categoryValue}
            allLabel={t.products.filter.allCategories}
            options={categoryOptions}
            className="mt-1"
            onValueChange={applyCategory}
          />
        </div>
        <div>
          <span className={ADMIN_LABEL}>{t.products.filter.stock}</span>
          <SelectDropdown
            name="stock"
            ariaLabel={t.products.filter.stock}
            value={stockValue}
            options={stockOptions}
            className="mt-1"
            onValueChange={applyStock}
          />
        </div>
      </form>
    </div>
  );
}
