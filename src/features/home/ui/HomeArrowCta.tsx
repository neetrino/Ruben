import { AppLink } from "@/components/ui/AppLink";
import { HomeArrowCtaIcon } from "@/features/home/ui/HomeArrowCtaIcon";

type HomeArrowCtaProps = {
  href: string;
  label: string;
  /** Black pill (default), yellow pill, or glass pill for dark photo overlays. */
  tone?: "dark" | "brand" | "ghost";
  /** Center the label in the space between the left edge and the arrow. */
  labelCentered?: boolean;
  className?: string;
};

export function HomeArrowCta({
  href,
  label,
  tone = "dark",
  labelCentered = false,
  className = "",
}: HomeArrowCtaProps) {
  const toneClass =
    tone === "brand"
      ? "bg-[var(--brand)] text-black hover:brightness-95"
      : tone === "ghost"
        ? "border border-white/45 bg-white/10 text-white backdrop-blur-md hover:border-white/70 hover:bg-white/15"
        : "bg-black text-white hover:bg-neutral-900";

  return (
    <AppLink
      href={href}
      prefetchPolicy="intent"
      className={`group inline-flex h-12 items-center rounded-full py-3 pr-1 pl-6 text-base font-bold tracking-wide uppercase transition ${labelCentered ? "gap-0" : "gap-4"} ${toneClass} ${className}`}
    >
      <span className={labelCentered ? "min-w-0 flex-1 text-center" : undefined}>
        {label}
      </span>
      <HomeArrowCtaIcon tone={tone === "brand" ? "dark" : "brand"} />
    </AppLink>
  );
}

export { HomeArrowCtaIcon } from "@/features/home/ui/HomeArrowCtaIcon";
