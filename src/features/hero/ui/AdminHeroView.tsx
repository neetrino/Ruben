"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ADMIN_PAGE_SUBTITLE,
  ADMIN_PAGE_TITLE,
  ADMIN_SECTION_TITLE,
} from "@/features/admin/ui/admin-form-classes";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import { ADMIN_BADGE } from "@/features/admin/ui/status-badge";
import type { AdminHeroSlideListItem } from "@/features/hero/application/queries";
import { HeroSlideModal } from "@/features/hero/ui/HeroSlideModal";

type AdminHeroViewProps = {
  locale: string;
  slides: AdminHeroSlideListItem[];
  initialEditId?: string;
};

export function AdminHeroView({
  locale,
  slides,
  initialEditId,
}: AdminHeroViewProps) {
  const t = adminCopy(locale);
  const initialSlide =
    initialEditId != null
      ? (slides.find((slide) => slide.id === initialEditId) ?? null)
      : null;
  const [modalOpen, setModalOpen] = useState(initialSlide != null);
  const [editingSlide, setEditingSlide] =
    useState<AdminHeroSlideListItem | null>(initialSlide);

  function openCreate(): void {
    setEditingSlide(null);
    setModalOpen(true);
  }

  function openEdit(slide: AdminHeroSlideListItem): void {
    setEditingSlide(slide);
    setModalOpen(true);
  }

  function closeModal(): void {
    setModalOpen(false);
    setEditingSlide(null);
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className={ADMIN_PAGE_TITLE}>{t.hero.title}</h1>
          <p className={`mt-1 ${ADMIN_PAGE_SUBTITLE}`}>
            {t.hero.count.replace("{count}", String(slides.length))}
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          {t.hero.create}
        </Button>
      </div>

      <div className="mb-4">
        <h2 className={ADMIN_SECTION_TITLE}>
          {t.hero.slidesHeading.replace("{count}", String(slides.length))}
        </h2>
      </div>

      {slides.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-sm text-gray-600">{t.hero.empty}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 2xl:grid-cols-4">
          {slides.map((slide) => (
            <Card
              key={slide.id}
              role="button"
              tabIndex={0}
              onClick={() => openEdit(slide)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openEdit(slide);
                }
              }}
              className="relative flex h-full cursor-pointer flex-col p-4 transition-shadow hover:shadow-md"
            >
              <span
                className={`absolute top-3 right-3 z-10 ${ADMIN_BADGE} ${
                  slide.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {slide.isActive ? t.hero.published : t.hero.draft}
              </span>

              <div className="flex min-w-0 flex-1 gap-3 pr-24">
                {slide.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                  <img
                    src={slide.imageUrl}
                    alt=""
                    className="h-16 w-24 shrink-0 rounded-lg border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-xs text-gray-400">
                    {t.hero.noImage}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">{slide.title}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {t.hero.sort.replace("{n}", String(slide.sortOrder))}
                  </p>
                  {slide.subtitle ? (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {slide.subtitle}
                    </p>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <HeroSlideModal
        locale={locale}
        open={modalOpen}
        onClose={closeModal}
        slide={editingSlide}
      />
    </section>
  );
}
