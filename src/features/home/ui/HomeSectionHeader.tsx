import { HomeArrowCta } from "@/features/home/ui/HomeArrowCta";
import { HomeMobileChevronLink } from "@/features/home/ui/HomeMobileChevronButton";

type HomeSectionHeaderProps = {
  title: string;
  viewAllLabel: string;
  viewAllHref: string;
};

/**
 * Section title + view-all control.
 * Mobile (Figma 171:485): title + 42px rounded square chevron.
 * Desktop: labeled pill CTA.
 */
export function HomeSectionHeader({
  title,
  viewAllLabel,
  viewAllHref,
}: HomeSectionHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3 lg:mb-10">
      <h2 className="text-[18px] leading-6 font-bold text-black uppercase lg:text-2xl lg:leading-normal">
        {title}
      </h2>

      <HomeMobileChevronLink
        href={viewAllHref}
        label={viewAllLabel}
        direction="right"
        className="lg:hidden"
      />

      <div className="hidden lg:block">
        <HomeArrowCta href={viewAllHref} label={viewAllLabel} />
      </div>
    </div>
  );
}
