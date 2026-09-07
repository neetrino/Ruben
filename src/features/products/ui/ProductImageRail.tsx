"use client";

import Image from "next/image";

import type { ProductGalleryImage } from "@/features/products/types";

type ProductImageRailProps = {
  images: ProductGalleryImage[];
  activeId: string | null;
  title: string;
  onSelect: (imageId: string) => void;
  /** Figma 122:2933 — flush to the right edge of the hero. */
  className?: string;
};

/**
 * Vertical image switcher — Figma 122:2933.
 * Maps gallery photos until product color variants exist in the domain.
 */
export function ProductImageRail({
  images,
  activeId,
  title,
  onSelect,
  className = "",
}: ProductImageRailProps) {
  if (images.length < 2) {
    return null;
  }

  return (
    <div
      className={`flex flex-col items-start justify-center gap-[14px] rounded-tl-[30px] rounded-bl-[30px] bg-[rgba(255,255,255,0.11)] p-2.5 backdrop-blur-[2px] ${className}`}
      role="group"
      aria-label={title}
    >
      {images.slice(0, 4).map((image) => {
        const selected = image.id === activeId;
        return (
          <button
            key={image.id}
            type="button"
            aria-label={image.alt || title}
            aria-pressed={selected}
            onClick={() => onSelect(image.id)}
            className={`relative size-[18px] shrink-0 overflow-hidden rounded-[9px] shadow-[0_1px_3px_rgba(0,0,0,0.15)] ${
              selected
                ? "border-[1.5px] border-[var(--brand)]"
                : "border-2 border-[#ccc]"
            }`}
          >
            <Image
              src={image.url}
              alt=""
              fill
              sizes="18px"
              className="object-cover"
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}
