"use client";

import type { ReactNode } from "react";

import { PageAppear } from "@/components/motion/PageAppear";

type AdminPageRevealProps = {
  children: ReactNode;
};

/** Soft rise on admin route change. */
export function AdminPageReveal({ children }: AdminPageRevealProps) {
  return (
    <PageAppear className="flex min-h-full flex-col" y={16}>
      {children}
    </PageAppear>
  );
}
