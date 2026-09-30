/**
 * Figma category-card art for the mobile home categories sheet
 * (nodes 319:366, 342:342, 342:345, 342:3343, 319:350, 319:353, 319:356).
 * Mapped by hy / en / ru root slugs.
 */
export type HomeCategorySheetArt = {
  src: string;
  /** Absolute frame, right-anchored to the 110×347 Figma card. */
  frameClassName: string;
  /** Optional rotation / flip wrapper around the image box. */
  transformClassName?: string;
  /** Sized box that holds the `<img>`. */
  imageBoxClassName: string;
  objectClassName?: string;
  /**
   * Replaces the default fill when Figma crops the photo inside the box
   * instead of using object-cover.
   */
  imageClassName?: string;
};

const CATEGORY_SHEET_ART_BY_SLUG = new Map<string, HomeCategorySheetArt>([
  // Paints — Figma 319:366
  ...mapArt(
    {
      src: "/assets/home/mobile/categories/paints.webp",
      frameClassName:
        "absolute top-[-35px] right-[-15px] flex size-[189px] items-center justify-center",
      transformClassName: "-scale-y-100 rotate-[174.08deg]",
      imageBoxClassName: "relative size-[172px]",
      objectClassName: "object-cover",
    },
    "ներկալաքային-նյութեր",
    "paints-and-coatings",
    "lakokrasochnye-materialy",
  ),
  // Wallpapers — Figma 342:342 inside card 269:571 (347×110).
  ...mapArt(
    {
      src: "/assets/home/mobile/categories/wallpapers.webp",
      frameClassName:
        "absolute top-[8px] right-[-13px] h-[189px] w-[204px] overflow-hidden",
      imageBoxClassName: "relative size-full",
      imageClassName:
        "pointer-events-none absolute top-[-43%] left-[-0.01%] h-[143%] w-[100.02%] max-w-none",
    },
    "պաստառներ-եւ-3d-պանելներ",
    "wallpapers-and-3d-panels",
    "oboi-i-3d-paneli",
  ),
  // Flooring — Figma 342:345 inside card 271:575 (347×110).
  ...mapArt(
    {
      src: "/assets/home/mobile/categories/flooring.webp",
      frameClassName:
        "absolute top-[-17px] right-[-43.46px] flex size-[216.456px] items-center justify-center",
      transformClassName: "rotate-[170.92deg]",
      imageBoxClassName: "relative size-[189px]",
      objectClassName: "object-cover",
    },
    "հատակի-ծածկույթներ",
    "floor-coverings",
    "napolnye-pokrytiya",
  ),
  // Tiles — Figma 342:3343 inside card 271:577 (347×110).
  ...mapArt(
    {
      src: "/assets/home/mobile/categories/tiles.webp",
      frameClassName: "absolute top-0 right-[1px] h-[274px] w-[153px]",
      imageBoxClassName: "relative size-full",
      objectClassName: "object-cover",
    },
    "սալիկներ",
    "tiles",
    "plitka",
  ),
  // Sanitaryware — Figma 319:350
  ...mapArt(
    {
      src: "/assets/home/mobile/categories/sanitary.webp",
      frameClassName: "absolute top-[-70px] right-[-42px] size-[233px]",
      imageBoxClassName: "relative size-full",
      objectClassName: "object-cover",
    },
    "սանկերամիկա",
    "sanitary-ware",
    "sankeramika",
  ),
  // Heating — Figma 319:353
  ...mapArt(
    {
      src: "/assets/home/mobile/categories/heating.webp",
      frameClassName:
        "absolute top-[9px] right-[-25px] flex h-[222px] w-[207px] items-center justify-center",
      transformClassName: "-scale-y-100 rotate-180",
      imageBoxClassName: "relative h-[222px] w-[207px]",
      objectClassName: "object-cover",
    },
    "ջեռուցման-եւ-ջրամատակարարման-համակարգեր",
    "heating-and-water-supply",
    "sistemy-otopleniya-i-vodosnabzheniya",
  ),
  // Tools — Figma 319:356
  ...mapArt(
    {
      src: "/assets/home/mobile/categories/tools.webp",
      frameClassName: "absolute top-[10px] right-0 h-[128px] w-[199px]",
      imageBoxClassName: "relative size-full",
      objectClassName: "object-cover",
    },
    "գործիքներ",
    "tools",
    "instrumenty",
  ),
]);

function mapArt(
  art: HomeCategorySheetArt,
  ...slugs: readonly string[]
): ReadonlyArray<readonly [string, HomeCategorySheetArt]> {
  return slugs.map((slug) => [slug, art] as const);
}

/** Resolves Figma sheet art for a root category slug, or `null` when unknown. */
export function getHomeCategorySheetArt(
  slug: string,
): HomeCategorySheetArt | null {
  return CATEGORY_SHEET_ART_BY_SLUG.get(slug.trim().toLowerCase()) ?? null;
}
