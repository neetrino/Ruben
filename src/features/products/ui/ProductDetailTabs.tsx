"use client";

import { useState } from "react";

type ProductDetailTabsProps = {
  descriptionLabel: string;
  specsLabel: string;
  fullDescriptionTitle: string;
  specsTitle: string;
  description: string | null;
  specs: Array<{ label: string; value: string }>;
  emptyDescription: string;
  emptySpecs: string;
};

export function ProductDetailTabs({
  descriptionLabel,
  specsLabel,
  fullDescriptionTitle,
  specsTitle,
  description,
  specs,
  emptyDescription,
  emptySpecs,
}: ProductDetailTabsProps) {
  const [tab, setTab] = useState<"description" | "specs">("description");

  const paragraphs = description
    ? description
        .split(/\n+/)
        .map((part) => part.trim())
        .filter((part) => part.length > 0)
    : [];

  return (
    <section className="border-t border-[#f0f0f0] py-8">
      <div className="flex flex-wrap gap-3" role="tablist" aria-label="Product details">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "description"}
          onClick={() => setTab("description")}
          className={`inline-flex h-[39px] items-center rounded-full px-6 text-sm font-semibold transition ${
            tab === "description"
              ? "bg-[#212121] text-white"
              : "border border-[#e0e0e0] bg-white text-[#212121] hover:bg-neutral-50"
          }`}
        >
          {descriptionLabel}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "specs"}
          onClick={() => setTab("specs")}
          className={`inline-flex h-[39px] items-center rounded-full px-6 text-sm font-semibold transition ${
            tab === "specs"
              ? "bg-[#212121] text-white"
              : "border border-[#e0e0e0] bg-white text-[#212121] hover:bg-neutral-50"
          }`}
        >
          {specsLabel}
        </button>
      </div>

      <div className="pt-8" role="tabpanel">
        {tab === "description" ? (
          <div>
            <h2 className="text-xl leading-[30px] font-bold tracking-[0.5px] text-black uppercase">
              {fullDescriptionTitle}
            </h2>
            {paragraphs.length > 0 ? (
              <div className="mt-4 flex flex-col gap-[22px]">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={`desc-${index}`}
                    className="text-[15px] leading-[27px] text-[#444]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-[15px] leading-[27px] text-[#888]">
                {emptyDescription}
              </p>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl leading-[30px] font-bold tracking-[0.5px] text-black uppercase">
              {specsTitle}
            </h2>
            {specs.length > 0 ? (
              <dl className="mt-4 divide-y divide-[#f0f0f0]">
                {specs.map((row) => (
                  <div
                    key={row.label}
                    className="flex gap-3 py-3 text-[15px] leading-6"
                  >
                    <dt className="w-40 shrink-0 text-[#888]">{row.label}</dt>
                    <dd className="font-semibold text-[#212121]">{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-[15px] leading-[27px] text-[#888]">
                {emptySpecs}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
