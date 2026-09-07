"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { STOREFRONT_PAGE_TITLE_FLUID_CLASS } from "@/components/layout/storefront-page-title";
import { Reveal } from "@/components/motion/Reveal";
import { RevealItem, RevealList } from "@/components/motion/RevealList";
import { SideSheet } from "@/components/ui/SideSheet";
import {
  LegalPolicyDocument,
  type LegalPolicyCopy,
} from "@/features/legal/ui/LegalPolicyDocument";
import type { LegalPolicyKey } from "@/features/legal/ui/LegalPolicyPage";

export type LegalPolicyListItem = {
  key: LegalPolicyKey;
  copy: LegalPolicyCopy;
};

type LegalPoliciesHubProps = {
  title: string;
  policies: readonly LegalPolicyListItem[];
};

/** Policies hub: every legal document in one list, each opens in a sheet. */
export function LegalPoliciesHub({
  title,
  policies,
}: LegalPoliciesHubProps) {
  const [activeKey, setActiveKey] = useState<LegalPolicyKey | null>(null);
  const active = policies.find((policy) => policy.key === activeKey) ?? null;

  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <h1 className={STOREFRONT_PAGE_TITLE_FLUID_CLASS}>{title}</h1>
      </Reveal>

      <RevealList as="ul" className="flex max-w-2xl flex-col gap-3">
        {policies.map((policy) => (
          <RevealItem as="li" key={policy.key}>
            <button
              type="button"
              onClick={() => setActiveKey(policy.key)}
              className="flex w-full items-center justify-between gap-3 rounded-[15px] border border-gray-100 bg-white px-4 py-4 text-left shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:bg-gray-50"
            >
              <span className="min-w-0 text-base font-semibold text-gray-900">
                {policy.copy.title}
              </span>
              <ChevronRight
                className="size-5 shrink-0 text-gray-400"
                aria-hidden
              />
            </button>
          </RevealItem>
        ))}
      </RevealList>

      <SideSheet
        open={active != null}
        onClose={() => setActiveKey(null)}
        ariaLabel={active?.copy.title ?? title}
        panelClassName="w-[87%] max-w-[420px]"
        zIndexClassName="z-[200]"
        backdropBlur
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {active ? <LegalPolicyDocument policy={active.copy} /> : null}
        </div>
      </SideSheet>
    </div>
  );
}
