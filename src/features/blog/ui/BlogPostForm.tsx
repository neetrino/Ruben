"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_SECTION_TITLE,
  ADMIN_TEXTAREA,
} from "@/features/admin/ui/admin-form-classes";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import { ADMIN_BADGE } from "@/features/admin/ui/status-badge";
import {
  archiveBlogPostAction,
  createBlogPostAction,
  publishBlogPostAction,
  updateBlogPostAction,
} from "@/features/blog/application/manage-blog";
import type { BlogPostStatus } from "@/features/blog/domain/blog-rules";
import {
  canArchiveBlogPost,
  canPublishBlogPost,
} from "@/features/blog/domain/blog-rules";
import type { UpsertBlogPostFormInput } from "@/features/blog/schemas/blog";
import { isLocale } from "@/lib/i18n/config";

type BlogPostFormProps = {
  locale: string;
  mode: "create" | "edit";
  postId?: string;
  status?: BlogPostStatus;
  defaults?: Partial<UpsertBlogPostFormInput>;
};

function blogStatusBadgeClass(status: string): string {
  const normalized = status.toUpperCase();
  if (normalized === "PUBLISHED") return "bg-green-100 text-green-800";
  if (normalized === "DRAFT") return "bg-yellow-100 text-yellow-800";
  if (normalized === "ARCHIVED") return "bg-gray-100 text-gray-800";
  return "bg-gray-100 text-gray-800";
}

export function BlogPostForm({
  locale,
  mode,
  postId,
  status,
  defaults,
}: BlogPostFormProps) {
  const t = adminCopy(locale);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const tagsDefault = defaults?.tags ?? "";

  function statusLabel(value: string): string {
    const normalized = value.toUpperCase();
    if (normalized === "PUBLISHED") return t.blog.status.published;
    if (normalized === "DRAFT") return t.blog.status.draft;
    if (normalized === "ARCHIVED") return t.blog.status.archived;
    return value;
  }

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <Card className="p-6">
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const payload: UpsertBlogPostFormInput = {
              editingLocale: isLocale(locale) ? locale : "en",
              title: String(formData.get("title") ?? ""),
              slug: String(formData.get("slug") ?? ""),
              excerpt: String(formData.get("excerpt") ?? "") || undefined,
              content: String(formData.get("content") ?? ""),
              seoTitle: String(formData.get("seoTitle") ?? "") || undefined,
              seoDescription:
                String(formData.get("seoDescription") ?? "") || undefined,
              tags: String(formData.get("tags") ?? "") || undefined,
              status: status ?? "DRAFT",
            };

            startTransition(async () => {
              setError(null);
              const result =
                mode === "edit" && postId
                  ? await updateBlogPostAction(locale, postId, payload)
                  : await createBlogPostAction(locale, payload);

              if (!result.ok) {
                setError(result.error.message);
                return;
              }

              router.push(`/${locale}/admin/blog/${result.value.id}`);
              router.refresh();
            });
          }}
        >
          <h2 className={ADMIN_SECTION_TITLE}>
            {mode === "edit" ? t.blog.form.editTitle : t.blog.form.createTitle}
          </h2>

          {status ? (
            <p className="text-sm text-gray-600">
              {t.blog.drawer.status}:{" "}
              <span
                className={`${ADMIN_BADGE} ${blogStatusBadgeClass(status)}`}
              >
                {statusLabel(status)}
              </span>
            </p>
          ) : null}

          <label>
            <span className={ADMIN_LABEL}>{t.blog.drawer.title}</span>
            <input
              name="title"
              required
              defaultValue={defaults?.title ?? ""}
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>
          <label>
            <span className={ADMIN_LABEL}>Slug</span>
            <input
              name="slug"
              required
              defaultValue={defaults?.slug ?? ""}
              placeholder="my-post-title"
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>
          <label>
            <span className={ADMIN_LABEL}>{t.blog.form.excerpt}</span>
            <textarea
              name="excerpt"
              rows={2}
              defaultValue={defaults?.excerpt ?? ""}
              className={ADMIN_TEXTAREA}
              disabled={isPending}
            />
          </label>
          <label>
            <span className={ADMIN_LABEL}>{t.blog.form.contentHtml}</span>
            <textarea
              name="content"
              required
              rows={10}
              defaultValue={defaults?.content ?? ""}
              className={`${ADMIN_TEXTAREA} font-mono`}
              disabled={isPending}
            />
          </label>
          <label>
            <span className={ADMIN_LABEL}>{t.blog.form.seoTitle}</span>
            <input
              name="seoTitle"
              defaultValue={defaults?.seoTitle ?? ""}
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>
          <label>
            <span className={ADMIN_LABEL}>{t.blog.form.seoDescription}</span>
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={defaults?.seoDescription ?? ""}
              className={ADMIN_TEXTAREA}
              disabled={isPending}
            />
          </label>
          <label>
            <span className={ADMIN_LABEL}>{t.blog.form.tags}</span>
            <input
              name="tags"
              defaultValue={tagsDefault}
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <Button type="submit" disabled={isPending}>
            {isPending
              ? t.common.saving
              : mode === "edit"
                ? t.blog.actions.saveChanges
                : t.common.create}
          </Button>
        </form>
      </Card>

      {mode === "edit" && postId && status ? (
        <div className="flex flex-wrap gap-2">
          {canPublishBlogPost(status) ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  setError(null);
                  const result = await publishBlogPostAction(locale, {
                    postId,
                  });
                  if (!result.ok) {
                    setError(result.error.message);
                    return;
                  }
                  router.refresh();
                });
              }}
            >
              {t.blog.actions.publish}
            </Button>
          ) : null}
          {canArchiveBlogPost(status) ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  setError(null);
                  const result = await archiveBlogPostAction(locale, {
                    postId,
                  });
                  if (!result.ok) {
                    setError(result.error.message);
                    return;
                  }
                  router.refresh();
                });
              }}
            >
              {t.blog.actions.archive}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
