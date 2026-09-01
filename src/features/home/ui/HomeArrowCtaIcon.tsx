const HOME_ARROW_CTA_PATH =
  "M28.9993 14.537C29.0198 13.9851 28.5889 13.5211 28.037 13.5007L19.0432 13.1676C18.4913 13.1471 18.0273 13.578 18.0069 14.1299C17.9864 14.6818 18.4172 15.1458 18.9692 15.1662L26.9637 15.4623L26.6676 23.4568C26.6471 24.0087 27.078 24.4727 27.6299 24.4931C28.1818 24.5136 28.6458 24.0828 28.6662 23.5308L28.9993 14.537ZM14 27.5L14.6805 28.2328L28.6805 15.2328L28 14.5L27.3195 13.7672L13.3195 26.7672L14 27.5Z";

const HOME_ARROW_CTA_MOTION_CLASS =
  "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-focus-visible:translate-x-[3px] group-focus-visible:-translate-y-[3px] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-visible:translate-x-0 motion-reduce:group-focus-visible:translate-y-0";

/** Yellow disc + diagonal arrow for home pill CTAs. Arrow shifts up-right on hover. */
export function HomeArrowCtaIcon() {
  return (
    <span
      className="flex size-[41px] shrink-0 items-center justify-center rounded-full bg-[var(--brand)]"
      aria-hidden
    >
      <svg
        viewBox="0 0 41 41"
        className="size-[41px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={HOME_ARROW_CTA_PATH}
          fill="black"
          className={HOME_ARROW_CTA_MOTION_CLASS}
        />
      </svg>
    </span>
  );
}
