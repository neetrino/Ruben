"use client";

import { useEffect, useId, useRef, useState } from "react";

import {
  formatCatalogSliderPrice,
  type CatalogPriceSliderBounds,
} from "@/features/products/domain/catalog-price-ranges";

type CatalogPriceSliderProps = {
  bounds: CatalogPriceSliderBounds;
  locale: string;
  minPrice?: number;
  maxPrice?: number;
  label: string;
  fromLabel: string;
  toLabel: string;
  onCommit: (next: {
    minPrice: number | undefined;
    maxPrice: number | undefined;
  }) => void;
};

const DEBOUNCE_MS = 280;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toFilterValue(
  value: number,
  edge: "min" | "max",
  bounds: CatalogPriceSliderBounds,
): number | undefined {
  if (edge === "min" && value <= bounds.min) return undefined;
  if (edge === "max" && value >= bounds.max) return undefined;
  return value;
}

export function CatalogPriceSlider({
  bounds,
  locale,
  minPrice,
  maxPrice,
  label,
  fromLabel,
  toLabel,
  onCommit,
}: CatalogPriceSliderProps) {
  const baseId = useId();
  const [minValue, setMinValue] = useState(minPrice ?? bounds.min);
  const [maxValue, setMaxValue] = useState(maxPrice ?? bounds.max);
  const [syncedKey, setSyncedKey] = useState(
    `${minPrice ?? ""}:${maxPrice ?? ""}`,
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const urlKey = `${minPrice ?? ""}:${maxPrice ?? ""}`;
  if (urlKey !== syncedKey) {
    setSyncedKey(urlKey);
    setMinValue(minPrice ?? bounds.min);
    setMaxValue(maxPrice ?? bounds.max);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function commit(nextMin: number, nextMax: number): void {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onCommit({
        minPrice: toFilterValue(nextMin, "min", bounds),
        maxPrice: toFilterValue(nextMax, "max", bounds),
      });
    }, DEBOUNCE_MS);
  }

  function onMinChange(raw: number): void {
    const nextMin = clamp(raw, bounds.min, maxValue);
    setMinValue(nextMin);
    commit(nextMin, maxValue);
  }

  function onMaxChange(raw: number): void {
    const nextMax = clamp(raw, minValue, bounds.max);
    setMaxValue(nextMax);
    commit(minValue, nextMax);
  }

  const span = Math.max(bounds.max - bounds.min, 1);
  const leftPercent = ((minValue - bounds.min) / span) * 100;
  const rightPercent = ((maxValue - bounds.min) / span) * 100;

  return (
    <div className="space-y-0">
      <div className="flex items-center gap-2 pt-0">
        <div className="flex min-w-0 flex-1 flex-col rounded-[12px] border border-[#e0e0e0] bg-transparent px-3 py-2">
          <span className="text-xs leading-[15px] text-[#999]">{fromLabel}</span>
          <span className="truncate text-[13px] leading-[19.5px] font-bold text-black">
            {formatCatalogSliderPrice(minValue, bounds.currency, locale)}
          </span>
        </div>
        <span className="text-base text-[#ccc]" aria-hidden="true">
          —
        </span>
        <div className="flex min-w-0 flex-1 flex-col rounded-[12px] border border-[#e0e0e0] bg-transparent px-3 py-2">
          <span className="text-xs leading-[15px] text-[#999]">{toLabel}</span>
          <span className="truncate text-[13px] leading-[19.5px] font-bold text-black">
            {formatCatalogSliderPrice(maxValue, bounds.currency, locale)}
          </span>
        </div>
      </div>

      <div className="relative mt-4 h-5">
        <div className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full bg-[#e0e0e0]" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-black"
          style={{
            left: `${leftPercent}%`,
            width: `${Math.max(rightPercent - leftPercent, 0)}%`,
          }}
        />

        <input
          id={`${baseId}-min`}
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={bounds.step}
          value={minValue}
          aria-label={`${label} ${fromLabel}`}
          className="catalog-price-thumb catalog-price-thumb-min absolute inset-0 z-20 m-0 w-full appearance-none bg-transparent p-0"
          onChange={(event) => onMinChange(Number(event.target.value))}
        />
        <input
          id={`${baseId}-max`}
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={bounds.step}
          value={maxValue}
          aria-label={`${label} ${toLabel}`}
          className="catalog-price-thumb catalog-price-thumb-max absolute inset-0 z-30 m-0 w-full appearance-none bg-transparent p-0"
          onChange={(event) => onMaxChange(Number(event.target.value))}
        />
      </div>
    </div>
  );
}
