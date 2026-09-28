/**
 * Figma category-card art for the mobile home categories sheet
 * (nodes 319:366, 307:383, 271:581, 319:343, 319:350, 319:353, 319:356).
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
};

const CATEGORY_SHEET_ART_BY_SLUG = new Map<string, HomeCategorySheetArt>([
  // Paints — Figma 319:366
  ...mapArt(
    {
      src: "/assets/home/mobile/categories/paints.png",
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
  // Wallpapers — Figma 307:383
  ...mapArt(
    {
      src: "/assets/home/mobile/categories/wallpapers.png",
      frameClassName:
        "absolute top-[-19px] right-0 flex h-[147px] w-[146px] items-center justify-center",
      transformClassName: "-scale-y-100 rotate-180",
      imageBoxClassName: "relative h-[147px] w-[146px]",
      objectClassName: "object-cover",
    },
    "պաստառներ-եւ-3d-պանելներ",
    "wallpapers-and-3d-panels",
    "oboi-i-3d-paneli",
  ),
  // Flooring — Figma 271:581
  ...mapArt(
    {
      src: "/assets/home/mobile/categories/flooring.png",
      frameClassName:
        "absolute top-[-51px] right-[-62px] flex h-[264px] w-[264px] items-center justify-center",
      transformClassName: "rotate-[-41.93deg]",
      imageBoxClassName: "relative h-[184px] w-[190px]",
      objectClassName: "object-bottom",
    },
    "հատակի-ծածկույթներ",
    "floor-coverings",
    "napolnye-pokrytiya",
  ),
  // Tiles — Figma 319:343
  ...mapArt(
    {
      src: "/assets/home/mobile/categories/tiles.png",
      frameClassName:
        "absolute top-[-39px] right-[-59px] flex h-[264px] w-[264px] items-center justify-center",
      transformClassName: "rotate-[-41.93deg]",
      imageBoxClassName: "relative h-[184px] w-[190px]",
      objectClassName: "object-cover",
    },
    "սալիկներ",
    "tiles",
    "plitka",
  ),
  // Sanitaryware — Figma 319:350
  ...mapArt(
    {
      src: "/assets/home/mobile/categories/sanitary.png",
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
      src: "/assets/home/mobile/categories/heating.png",
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
      src: "/assets/home/mobile/categories/tools.png",
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
