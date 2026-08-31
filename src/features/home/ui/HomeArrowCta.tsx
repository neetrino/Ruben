import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import { HOME_ASSETS } from "@/features/home/config/assets";

type HomeArrowCtaProps = {
  href: string;
  label: string;
  /** Black pill (default) or yellow pill for hero. */
  tone?: "dark" | "brand";
  className?: string;
};

export function HomeArrowCta({
  href,
  label,
  tone = "dark",
  className = "",
}: HomeArrowCtaProps) {
  const toneClass =
    tone === "brand"
      ? "bg-[var(--brand)] text-black hover:brightness-95"
      : "bg-black text-white hover:bg-neutral-900";

  return (
    <AppLink
      href={href}
      prefetchPolicy="intent"
      className={`inline-flex h-12 items-center gap-4 rounded-full py-3 pr-3 pl-6 text-base font-bold uppercase tracking-wide transition ${toneClass} ${className}`}
    >
      <span>{label}</span>
      <Image
        src={HOME_ASSETS.arrowCta}
        alt=""
        width={41}
        height={41}
        className="size-[41px] shrink-0"
        aria-hidden
      />
    </AppLink>
  );
}
