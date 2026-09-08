"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

import { LazyWhenVisible } from "@/components/loading/LazyWhenVisible";
import { formatBranchAddress, type StoreBranch } from "@/lib/store/branches";
import { storeMapEmbedSrc } from "@/lib/store/maps";

type ContactMapProps = {
  title: string;
  tabsTitle: string;
  branches: readonly StoreBranch[];
};

const MAP_ROOT_MARGIN = "240px 0px";

const TAB_CLASS =
  "flex min-h-[3.25rem] items-start gap-2.5 rounded-[15px] border px-4 py-3 text-left text-sm leading-snug font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]";
const TAB_SELECTED_CLASS = "border-brand bg-brand/10 text-gray-900 shadow-sm";
const TAB_IDLE_CLASS =
  "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50";

/** Below-the-fold map — branch tabs switch the embed, mounted when near the viewport. */
export function ContactMap({ title, tabsTitle, branches }: ContactMapProps) {
  const [selectedAddress, setSelectedAddress] = useState(
    branches[0]?.address ?? "",
  );
  const [isReady, setIsReady] = useState(false);

  const selectedBranch =
    branches.find((branch) => branch.address === selectedAddress) ??
    branches[0];

  if (!selectedBranch) {
    return null;
  }

  return (
    <section
      className="relative z-10 mt-4 border-t border-gray-100 bg-white px-4 pb-12 [content-visibility:auto] [contain-intrinsic-size:auto_640px] sm:px-6 sm:pb-16 lg:px-8 lg:pb-20"
      aria-label={title}
    >
      <div className="mx-auto max-w-7xl pt-10 sm:pt-12">
        <p className="text-[11px] font-bold tracking-[0.08em] text-gray-500 uppercase">
          {tabsTitle}
        </p>

        <div
          className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3"
          role="tablist"
          aria-label={tabsTitle}
        >
          {branches.map((branch) => {
            const isSelected = branch.address === selectedBranch.address;

            return (
              <button
                key={branch.address}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`${TAB_CLASS} ${
                  isSelected ? TAB_SELECTED_CLASS : TAB_IDLE_CLASS
                }`}
                onClick={() => {
                  setSelectedAddress(branch.address);
                  setIsReady(false);
                }}
              >
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]"
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  {formatBranchAddress(branch)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 overflow-hidden rounded-[20px] border border-gray-200/80 bg-gray-100 shadow-[0_18px_50px_-28px_rgba(17,24,39,0.22)]">
          <LazyWhenVisible
            rootMargin={MAP_ROOT_MARGIN}
            className="relative h-[min(500px,70vw)] w-full sm:h-[500px]"
            fallback={
              <div className="h-full w-full animate-pulse bg-gray-100" aria-hidden />
            }
          >
            {!isReady ? (
              <div className="absolute inset-0 animate-pulse bg-gray-100" aria-hidden />
            ) : null}
            <iframe
              key={selectedBranch.address}
              title={`${title} — ${formatBranchAddress(selectedBranch)}`}
              src={storeMapEmbedSrc(selectedBranch.address)}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsReady(true)}
              className={`h-full w-full border-0 transition-opacity duration-500 ease-out ${
                isReady ? "opacity-100" : "opacity-0"
              }`}
              allowFullScreen
            />
          </LazyWhenVisible>
        </div>
      </div>
    </section>
  );
}
