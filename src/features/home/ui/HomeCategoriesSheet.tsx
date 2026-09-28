"use client";

import { AppLink } from "@/components/ui/AppLink";
import { CategoryIcon } from "@/features/categories/ui/category-icons";
import {
  getHomeCategorySheetArt,
  type HomeCategorySheetArt,
} from "@/features/home/config/category-sheet-art";
import { HOME_MOBILE_ASSETS } from "@/features/home/config/assets";
import { ProfileMobileTabSheet } from "@/features/profile/ui/ProfileMobileTabSheet";

type HomeCategoriesSheetItem = {
  id: string;
  title: string;
  slug: string;
  href: string;
  imageUrl: string | null;
};

type HomeCategoriesSheetProps = {
  open: boolean;
  onClose: () => void;
  categories: readonly HomeCategoriesSheetItem[];
  allCategoriesLabel: string;
  allHref: string;
  ariaLabel: string;
  closeLabel: string;
};

/**
 * Mobile home categories sheet — Kamancha-style bottom panel
 * ({@link ProfileMobileTabSheet}) with category cards (Figma 269:473 content).
 */
export function HomeCategoriesSheet({
  open,
  onClose,
  categories,
  allCategoriesLabel,
  allHref,
  ariaLabel,
  closeLabel,
}: HomeCategoriesSheetProps) {
  return (
    <ProfileMobileTabSheet
      open={open}
      onClose={onClose}
      ariaLabel={ariaLabel}
      closeLabel={closeLabel}
      showHandle={false}
      topRadiusPx={20}
    >
      <ul
        id="home-categories-sheet"
        className="flex flex-col gap-2.5 px-0.5 pt-6"
      >
        <li>
          <AppLink
            href={allHref}
            prefetchPolicy="intent"
            onClick={onClose}
            className="relative flex h-[110px] overflow-hidden rounded-[26px] bg-[#1f1f1f]"
          >
            <span className="relative z-[1] max-w-[140px] px-[23px] pt-[23px] text-base font-semibold leading-5 text-white">
              {allCategoriesLabel}
            </span>
            {/* Figma 269:573 — kiosk crop on the right of the All card. */}
            <span
              className="pointer-events-none absolute top-[7px] right-[-22px] h-[128px] w-[152px] overflow-hidden"
              aria-hidden
            >
              {/* Native img — next/image wrapper breaks absolute Figma crop. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HOME_MOBILE_ASSETS.categoriesAllKiosk}
                alt=""
                className="absolute top-[-55%] left-[-39%] h-[210%] w-[178%] max-w-none"
              />
            </span>
          </AppLink>
        </li>

        {categories.map((category) => {
          const sheetArt = getHomeCategorySheetArt(category.slug);

          return (
            <li key={category.id}>
              <AppLink
                href={category.href}
                prefetchPolicy="intent"
                onClick={onClose}
                className="relative flex h-[110px] overflow-hidden rounded-[26px] bg-[#dbdbdb]"
              >
                <span className="relative z-[1] max-w-[170px] px-[23px] pt-[19px] text-base leading-normal text-black">
                  {category.title}
                </span>
                {sheetArt ? (
                  <CategorySheetArt art={sheetArt} />
                ) : category.imageUrl ? (
                  <span
                    className="pointer-events-none absolute inset-y-[-12%] right-[-4%] w-[58%]"
                    aria-hidden
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={category.imageUrl}
                      alt=""
                      className="absolute inset-0 size-full object-contain object-right"
                    />
                  </span>
                ) : (
                  <CategoryIcon
                    slug={category.slug}
                    title={category.title}
                    className="pointer-events-none absolute top-1/2 right-6 size-16 -translate-y-1/2 text-black/35"
                  />
                )}
              </AppLink>
            </li>
          );
        })}
      </ul>
    </ProfileMobileTabSheet>
  );
}

function CategorySheetArt({ art }: { art: HomeCategorySheetArt }) {
  const image = (
    <div className={art.imageBoxClassName}>
      {/* Native img — preserves Figma absolute crop / rotate without next/image span. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={art.src}
        alt=""
        className={`absolute inset-0 size-full max-w-none pointer-events-none ${art.objectClassName ?? "object-cover"}`}
      />
    </div>
  );

  return (
    <span className={`pointer-events-none ${art.frameClassName}`} aria-hidden>
      {art.transformClassName ? (
        <span className={`flex-none ${art.transformClassName}`}>{image}</span>
      ) : (
        image
      )}
    </span>
  );
}
