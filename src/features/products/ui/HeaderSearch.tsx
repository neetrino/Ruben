"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Search, X } from "lucide-react";

import { HEADER_ASSETS } from "@/components/layout/header-assets";
import { AppLink } from "@/components/ui/AppLink";
import { catalogHref } from "@/features/products/domain/catalog-url";
import { DEFAULT_CATALOG_FILTERS } from "@/features/products/schemas/catalog-list";
import {
  searchHeaderProductsAction,
  type HeaderSearchProduct,
} from "@/features/products/application/search-header-products-action";
import type { Locale } from "@/lib/i18n/config";
import type { Currency } from "@/lib/money/currency";

const SEARCH_DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 1;

const ICON_BUTTON =
  "relative inline-flex size-[35px] items-center justify-center text-white outline-none transition-opacity hover:opacity-80";

type HeaderSearchLabels = {
  open: string;
  close: string;
  placeholder: string;
  idle: string;
  empty: string;
  viewAll: string;
};

type HeaderSearchProps = {
  locale: Locale;
  currency: Currency;
  labels: HeaderSearchLabels;
};

/**
 * Header search icon (storefront chrome) with live product-name results panel.
 */
export function HeaderSearch({
  locale,
  currency,
  labels,
}: HeaderSearchProps) {
  const router = useRouter();
  const inputId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);

  const [query, setQuery] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [products, setProducts] = useState<HeaderSearchProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const trimmedQuery = query.trim();
  const queryTooShort = trimmedQuery.length < MIN_QUERY_LENGTH;
  const displayProducts = queryTooShort ? [] : products;
  const displaySearchedQuery = queryTooShort ? "" : searchedQuery;
  const showIdle = displaySearchedQuery.length === 0 && !pending;
  const showEmpty =
    displaySearchedQuery.length > 0 && displayProducts.length === 0 && !pending;
  const viewAllHref = catalogHref(locale, DEFAULT_CATALOG_FILTERS, {
    q: displaySearchedQuery || trimmedQuery,
    sort: "newest",
    page: 1,
  });

  useEffect(() => {
    if (!panelOpen) return;
    inputRef.current?.focus();
  }, [panelOpen]);

  useEffect(() => {
    if (!panelOpen) return;

    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      requestIdRef.current += 1;
      return;
    }

    const requestId = ++requestIdRef.current;
    const timer = window.setTimeout(() => {
      startTransition(async () => {
        const result = await searchHeaderProductsAction(
          locale,
          currency,
          trimmed,
        );
        if (requestId !== requestIdRef.current) return;
        setProducts(result.products);
        setTotal(result.total);
        setSearchedQuery(result.query);
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [panelOpen, query, locale, currency]);

  useEffect(() => {
    if (!panelOpen) return;

    function handlePointerDown(event: MouseEvent): void {
      const root = rootRef.current;
      if (!root || root.contains(event.target as Node)) return;
      setPanelOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [panelOpen]);

  function clearSearch(): void {
    setQuery("");
    setProducts([]);
    setTotal(0);
    setSearchedQuery("");
    inputRef.current?.focus();
  }

  function closePanel(): void {
    setPanelOpen(false);
  }

  function togglePanel(): void {
    setPanelOpen((open) => !open);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (trimmedQuery.length < MIN_QUERY_LENGTH) return;
    closePanel();
    router.push(viewAllHref);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key !== "Escape") return;
    if (query.length > 0) {
      clearSearch();
      return;
    }
    closePanel();
  }

  return (
    <div ref={rootRef} className="relative hidden sm:block">
      <button
        type="button"
        className={ICON_BUTTON}
        aria-label={labels.open}
        aria-expanded={panelOpen}
        aria-controls={panelOpen ? inputId : undefined}
        onClick={togglePanel}
      >
        <Image
          src={HEADER_ASSETS.search}
          alt=""
          width={24}
          height={24}
          className="size-6"
          aria-hidden
        />
      </button>

      {panelOpen ? (
        <div
          className="absolute top-[calc(100%+8px)] right-0 z-50 flex max-h-[min(70vh,480px)] w-[min(calc(100vw-2rem),22rem)] flex-col overflow-hidden rounded-2xl bg-white text-left shadow-xl"
          role="dialog"
          aria-label={labels.open}
        >
          <form
            onSubmit={handleSubmit}
            role="search"
            className="border-b border-gray-100 px-3 py-3"
          >
            <label
              htmlFor={inputId}
              className="flex items-center gap-2 rounded-full bg-gray-100 px-3.5 py-2.5"
            >
              <Search
                className="h-4 w-4 shrink-0 text-gray-500"
                aria-hidden="true"
              />
              <span className="sr-only">{labels.open}</span>
              <input
                ref={inputRef}
                id={inputId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={labels.placeholder}
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400 [&::-webkit-search-cancel-button]:hidden"
              />
              {query.length > 0 ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label={labels.close}
                  className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              ) : null}
            </label>
          </form>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {showIdle ? (
              <p className="px-5 py-6 text-center text-sm text-gray-500">
                {labels.idle}
              </p>
            ) : null}
            {pending && displayProducts.length === 0 ? (
              <div className="space-y-3 px-4 py-4" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex animate-pulse items-center gap-3"
                  >
                    <div className="h-14 w-14 rounded-lg bg-gray-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 rounded bg-gray-100" />
                      <div className="h-3 w-1/3 rounded bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {showEmpty ? (
              <p className="px-5 py-6 text-center text-sm text-gray-500">
                {labels.empty}
              </p>
            ) : null}
            {displayProducts.length > 0 ? (
              <ul
                className={`divide-y divide-gray-100 ${pending ? "opacity-70" : ""}`}
              >
                {displayProducts.map((product) => (
                  <li key={product.id}>
                    <AppLink
                      href={product.href}
                      prefetchPolicy="intent"
                      onClick={closePanel}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {product.title}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-600">
                          {product.compareAtFormatted ? (
                            <>
                              <span className="mr-2 text-gray-400 line-through">
                                {product.compareAtFormatted}
                              </span>
                              <span>{product.priceFormatted}</span>
                            </>
                          ) : (
                            product.priceFormatted
                          )}
                        </p>
                      </div>
                    </AppLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {displaySearchedQuery && total > displayProducts.length ? (
            <div className="border-t border-gray-200 px-4 py-3">
              <AppLink
                href={viewAllHref}
                prefetchPolicy="intent"
                onClick={closePanel}
                className="block text-center text-sm font-medium text-gray-900 transition-colors hover:text-gray-600"
              >
                {labels.viewAll}
              </AppLink>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
