import type { LucideIcon } from "lucide-react";
import {
  AirVent,
  Bath,
  Beaker,
  Blend,
  Box,
  BrickWall,
  Brush,
  CircleDot,
  Container,
  Cuboid,
  Cylinder,
  Droplet,
  Droplets,
  FlaskConical,
  Flame,
  Gauge,
  GlassWater,
  Grid2x2,
  Hammer,
  Heater,
  House,
  LayoutGrid,
  Layers3,
  LayoutPanelTop,
  MirrorRound,
  MoreHorizontal,
  PaintBucket,
  Paintbrush,
  PaintbrushVertical,
  PaintRoller,
  Palette,
  Pipette,
  Settings2,
  ShowerHead,
  SoapDispenserDroplet,
  Sofa,
  Sparkles,
  SprayCan,
  SquareStack,
  StickyNote,
  ThermometerSun,
  Toilet,
  Toolbox,
  Wallpaper,
  Wrench,
  Zap,
} from "lucide-react";

/** Registers the same Lucide icon under every locale slug for a category. */
function mapSlugs(
  icon: LucideIcon,
  ...slugs: readonly string[]
): ReadonlyArray<readonly [string, LucideIcon]> {
  return slugs.map((slug) => [slug, icon] as const);
}

/**
 * Catalog category → Lucide icon.
 * Keys cover hy / en / ru slugs from the RUBEN category tree.
 * Lucide is the project icon set and has the best bathroom / paint / tool coverage.
 */
const CATEGORY_ICON_BY_SLUG = new Map<string, LucideIcon>([
  // Roots
  ...mapSlugs(
    PaintBucket,
    "ներկալաքային-նյութեր",
    "paints-and-coatings",
    "lakokrasochnye-materialy",
  ),
  ...mapSlugs(
    Wallpaper,
    "պաստառներ-եւ-3d-պանելներ",
    "wallpapers-and-3d-panels",
    "oboi-i-3d-paneli",
  ),
  ...mapSlugs(
    Layers3,
    "հատակի-ծածկույթներ",
    "floor-coverings",
    "napolnye-pokrytiya",
  ),
  ...mapSlugs(Grid2x2, "սալիկներ", "tiles", "plitka"),
  ...mapSlugs(Bath, "սանկերամիկա", "sanitary-ware", "sankeramika"),
  ...mapSlugs(
    Heater,
    "ջեռուցման-եւ-ջրամատակարարման-համակարգեր",
    "heating-and-water-supply",
    "sistemy-otopleniya-i-vodosnabzheniya",
  ),
  ...mapSlugs(Wrench, "գործիքներ", "tools", "instrumenty"),

  // Paints
  ...mapSlugs(Paintbrush, "ինտերիերային-ներկեր", "interior-paints", "interiernye-kraski"),
  ...mapSlugs(House, "ֆասադային-ներկեր", "facade-paints", "fasadnye-kraski"),
  ...mapSlugs(Palette, "դեկորատիվ-ներկեր", "decorative-paints", "dekorativnye-kraski"),
  ...mapSlugs(SprayCan, "աէրոզոլային-ներկեր", "aerosol-paints", "aerozolnye-kraski"),
  ...mapSlugs(Droplet, "յուղաներկեր", "oil-paints", "maslyanye-kraski"),
  ...mapSlugs(Blend, "նախաներկեր", "primers", "gruntovki"),
  ...mapSlugs(Sparkles, "լաքեր", "varnishes", "laki"),
  ...mapSlugs(FlaskConical, "լուծիչներ", "solvents", "rastvoriteli"),
  ...mapSlugs(Beaker, "անտիսեպտիկներ", "antiseptics", "antiseptiki"),
  ...mapSlugs(PaintbrushVertical, "ծեփամածիկներ", "putties", "shpatlevki"),
  ...mapSlugs(Pipette, "գունանյութեր", "pigments", "pigmenty"),
  ...mapSlugs(
    StickyNote,
    "սոսինձներ-եւ-հերմետիկներ",
    "adhesives-and-sealants",
    "klei-i-germetiki",
  ),

  // Wallpapers
  ...mapSlugs(Wallpaper, "պաստառներ", "wallpapers", "oboi"),
  ...mapSlugs(Cuboid, "3d-պանելներ", "3d-panels", "3d-paneli"),
  ...mapSlugs(StickyNote, "սոսինձներ", "wallpaper-adhesives", "klei-dlya-oboev"),

  // Floors
  ...mapSlugs(SquareStack, "լամինատե-հատակներ", "laminate-flooring", "laminat"),
  ...mapSlugs(LayoutPanelTop, "վինիլային-հատակներ", "vinyl-flooring", "vinilovye-poly"),
  ...mapSlugs(Box, "շրիշակներ", "carpets", "kovrovye-pokrytiya"),

  // Tiles
  ...mapSlugs(BrickWall, "կերամոգրանիտ", "porcelain-stoneware", "keramogranit"),
  ...mapSlugs(Sparkles, "դեկորատիվ-սալիկներ", "decorative-tiles", "dekorativnaya-plitka"),
  ...mapSlugs(
    StickyNote,
    "սոսինձներ-եւ-կարանյութեր",
    "tile-adhesives-and-grouts",
    "klei-i-zatirki",
  ),

  // Sanitary
  ...mapSlugs(Sofa, "լոգասենյակի-կահույք", "bathroom-furniture", "mebel-dlya-vannoy"),
  ...mapSlugs(GlassWater, "լվացարաններ", "sinks", "rakoviny"),
  ...mapSlugs(Toilet, "զուգարանակոնքեր", "toilets", "unitazy"),
  ...mapSlugs(Bath, "վաննաներ", "bathtubs", "vanny"),
  ...mapSlugs(MirrorRound, "հայելիներ", "mirrors", "zerkala"),
  ...mapSlugs(
    ShowerHead,
    "ցնցուղներ-եւ-ծորակներ",
    "showers-and-faucets",
    "dushi-i-smesiteli",
  ),
  ...mapSlugs(Droplets, "բիդեներ", "bidets", "bide"),
  ...mapSlugs(CircleDot, "հոսակներ", "drains", "slivy"),
  ...mapSlugs(Cylinder, "սիֆոններ", "siphons", "sifony"),
  ...mapSlugs(
    SoapDispenserDroplet,
    "լոգասենյակի-աքսեսուարներ",
    "bathroom-accessories",
    "aksessuary-dlya-vannoy",
  ),

  // Heating / water
  ...mapSlugs(Flame, "ջեռուցման-կաթսաներ", "heating-boilers", "otopitelnye-kotly"),
  ...mapSlugs(ThermometerSun, "մարտկոցներ", "radiators", "radiatory"),
  ...mapSlugs(AirVent, "չորանոցներ", "towel-dryers", "polotentsesushiteli"),
  ...mapSlugs(Container, "ընդարձակման-բաքեր", "expansion-tanks", "rasshiritelnye-baki"),
  ...mapSlugs(Gauge, "պոմպեր", "pumps", "nasosy"),
  ...mapSlugs(
    Zap,
    "էլեկտրական-տաքացուցիչներ",
    "electric-heaters",
    "elektricheskie-nagrevateli",
  ),
  ...mapSlugs(Cylinder, "խողովակներ", "pipes", "truby"),
  ...mapSlugs(
    Settings2,
    "փականներ-եւ-կցամասեր",
    "valves-and-fittings",
    "klapany-i-fitingi",
  ),

  // Tools
  ...mapSlugs(PaintRoller, "գլանվակներ", "paint-rollers", "valiki"),
  ...mapSlugs(Brush, "վրձիններ", "brushes", "kisti"),
  ...mapSlugs(
    Hammer,
    "մածկաթիակներ-եւ-հարթիչներ",
    "spatulas-and-trowels",
    "shpateli-i-gladilki",
  ),
  ...mapSlugs(StickyNote, "ինքնակպչուն-ժապավեններ", "adhesive-tapes", "kleykie-lenty"),
  ...mapSlugs(
    PaintBucket,
    "ներկամաններ-եւ-դույլեր",
    "paint-trays-buckets",
    "kyuvety-i-vedra",
  ),
  ...mapSlugs(CircleDot, "հղկաթուղթ", "sandpaper", "nazhdachnaya-bumaga"),
  ...mapSlugs(MoreHorizontal, "այլ", "tools-other", "prochee-instrumenty"),
]);

const SLUG_HINTS: ReadonlyArray<{ needle: string; icon: LucideIcon }> = [
  { needle: "paint", icon: PaintBucket },
  { needle: "wallpaper", icon: Wallpaper },
  { needle: "oboi", icon: Wallpaper },
  { needle: "floor", icon: Layers3 },
  { needle: "laminat", icon: SquareStack },
  { needle: "tile", icon: Grid2x2 },
  { needle: "plitka", icon: Grid2x2 },
  { needle: "bath", icon: Bath },
  { needle: "shower", icon: ShowerHead },
  { needle: "toilet", icon: Toilet },
  { needle: "heat", icon: Heater },
  { needle: "boiler", icon: Flame },
  { needle: "tool", icon: Wrench },
  { needle: "brush", icon: Brush },
  { needle: "roller", icon: PaintRoller },
  { needle: "sink", icon: GlassWater },
  { needle: "mirror", icon: MirrorRound },
  { needle: "pipe", icon: Cylinder },
  { needle: "pump", icon: Gauge },
  { needle: "nasosy", icon: Gauge },
  { needle: "valve", icon: Settings2 },
  { needle: "adhesive", icon: StickyNote },
  { needle: "klei", icon: StickyNote },
];

const TITLE_HINTS: ReadonlyArray<{ re: RegExp; icon: LucideIcon }> = [
  { re: /ներկ|paint|краск|лакокрас/i, icon: PaintBucket },
  { re: /պաստառ|wallpaper|обои/i, icon: Wallpaper },
  { re: /հատակ|floor|напольн|ламинат/i, icon: Layers3 },
  { re: /սալիկ|tile|плитк/i, icon: Grid2x2 },
  { re: /սանկերամ|sanitary|санкерам|վանն|bath|душ|ցնցուղ/i, icon: Bath },
  { re: /ջեռուց|heating|отоплен|ջրամատակարար|водоснаб/i, icon: Heater },
  { re: /գործիք|tool|инструмент/i, icon: Wrench },
];

/** Lucide icon for the “All categories” chip. */
export const ALL_CATEGORIES_ICON: LucideIcon = LayoutGrid;

/** Fallback when no slug/title match is found. */
export const DEFAULT_CATEGORY_ICON: LucideIcon = Toolbox;

/**
 * Resolves the best Lucide icon for a catalog category.
 * Prefers exact slug (hy/en/ru), then slug keywords, then title keywords.
 */
export function getCategoryIcon(
  slug: string,
  title?: string,
): LucideIcon {
  const normalized = slug.trim().toLowerCase();
  const exact = CATEGORY_ICON_BY_SLUG.get(normalized);
  if (exact) return exact;

  for (const hint of SLUG_HINTS) {
    if (normalized.includes(hint.needle)) return hint.icon;
  }

  if (title) {
    for (const hint of TITLE_HINTS) {
      if (hint.re.test(title)) return hint.icon;
    }
  }

  return DEFAULT_CATEGORY_ICON;
}

type CategoryIconProps = {
  slug: string;
  title?: string;
  className?: string;
};

/** Renders the Lucide icon matched to a category slug/title. */
export function CategoryIcon({
  slug,
  title,
  className = "size-5 shrink-0",
}: CategoryIconProps) {
  const Icon = getCategoryIcon(slug, title);
  return <Icon className={className} aria-hidden />;
}
