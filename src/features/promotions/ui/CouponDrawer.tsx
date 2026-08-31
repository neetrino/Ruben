"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { SideSheet } from "@/components/ui/SideSheet";
import {
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "@/features/admin/ui/admin-form-classes";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import {
  createPromotionAction,
  updatePromotionAction,
} from "@/features/promotions/application/upsert-promotion";
import type { AdminPromotionListItem } from "@/features/promotions/application/queries";
import type { DiscountType } from "@/features/promotions/domain/promotion-rules";

type CouponDrawerCoupon = Pick<
  AdminPromotionListItem,
  | "id"
  | "code"
  | "discountType"
  | "discountValue"
  | "totalUsageLimit"
  | "endsAt"
  | "isActive"
>;

type CouponDrawerProps = {
  locale: string;
  open: boolean;
  onClose: () => void;
  coupon?: CouponDrawerCoupon | null;
};

function toDateTimeLocal(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

export function CouponDrawer({
  locale,
  open,
  onClose,
  coupon = null,
}: CouponDrawerProps) {
  const router = useRouter();
  const t = adminCopy(locale);
  const isEdit = coupon != null;
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] =
    useState<DiscountType>("PERCENTAGE");
  const [value, setValue] = useState("10");
  const [quantity, setQuantity] = useState("1");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;

    if (coupon) {
      setName(coupon.code ?? "");
      setCode(coupon.code ?? "");
      setDiscountType(
        coupon.discountType === "FIXED" ? "FIXED" : "PERCENTAGE",
      );
      setValue(String(coupon.discountValue));
      setQuantity(
        coupon.totalUsageLimit != null ? String(coupon.totalUsageLimit) : "",
      );
      setExpiresAt(toDateTimeLocal(coupon.endsAt));
      setError(null);
    } else {
      setName("");
      setCode("");
      setDiscountType("PERCENTAGE");
      setValue("10");
      setQuantity("1");
      setExpiresAt("");
      setError(null);
    }
  }, [open, coupon]);

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      ariaLabel={isEdit ? t.coupons.drawer.editTitle : t.coupons.drawer.createTitle}
      panelClassName="w-full max-w-md"
    >
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? t.coupons.drawer.editTitle : t.coupons.drawer.createTitle}
          </h2>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            const nextCode = (code.trim() || name.trim()).toUpperCase();
            if (!nextCode) {
              setError(t.coupons.drawer.codeRequired);
              return;
            }

            const payload = {
              kind: "COUPON" as const,
              code: nextCode,
              productId: null,
              categoryId: null,
              discountType,
              discountValue: Number(value),
              maxDiscountAmount: null,
              minimumOrderAmount: null,
              totalUsageLimit: quantity ? Number(quantity) : null,
              perUserUsageLimit: null,
              priority: 0,
              allowStacking: false,
              isActive: coupon?.isActive ?? true,
              startsAt: null,
              endsAt: expiresAt ? new Date(expiresAt) : null,
            };

            startTransition(async () => {
              setError(null);
              const result =
                isEdit && coupon
                  ? await updatePromotionAction(locale, coupon.id, payload)
                  : await createPromotionAction(locale, payload);

              if (!result.ok) {
                setError(result.error.message);
                return;
              }

              onClose();
              router.refresh();
            });
          }}
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className={ADMIN_LABEL}>{t.coupons.drawer.name}</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t.coupons.drawer.name}
                  className={ADMIN_INPUT}
                  disabled={isPending}
                />
              </label>
              <label>
                <span className={ADMIN_LABEL}>{t.coupons.drawer.code}</span>
                <input
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.toUpperCase())
                  }
                  placeholder={t.coupons.drawer.code}
                  className={`${ADMIN_INPUT} uppercase`}
                  disabled={isPending}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className={ADMIN_LABEL}>{t.coupons.drawer.discountType}</span>
                <SelectDropdown
                  ariaLabel={t.coupons.drawer.discountType}
                  value={discountType}
                  options={[
                    { label: t.coupons.type.percent, value: "PERCENTAGE" },
                    { label: t.coupons.type.fixed, value: "FIXED" },
                  ]}
                  disabled={isPending}
                  deferChange={false}
                  className="mt-1"
                  onValueChange={(next) =>
                    setDiscountType(next as DiscountType)
                  }
                />
              </div>
              <label>
                <span className={ADMIN_LABEL}>{t.coupons.drawer.value}</span>
                <input
                  type="number"
                  min={1}
                  required
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  className={ADMIN_INPUT}
                  disabled={isPending}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className={ADMIN_LABEL}>{t.coupons.drawer.quantity}</span>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className={ADMIN_INPUT}
                  disabled={isPending}
                />
              </label>
              <label>
                <span className={ADMIN_LABEL}>{t.coupons.drawer.expires}</span>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(event) => setExpiresAt(event.target.value)}
                  className={ADMIN_INPUT}
                  disabled={isPending}
                />
              </label>
            </div>

            <div className="rounded-2xl border border-gray-200 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {t.coupons.drawer.selectUsers}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {t.coupons.drawer.allUsers}
                  </p>
                </div>
                <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
              </div>
            </div>

            {error ? <p className="text-sm text-red-700">{error}</p> : null}
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-gray-200 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {t.common.cancel}
            </button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEdit
                  ? t.common.saving
                  : t.common.creating
                : isEdit
                  ? t.common.save
                  : t.common.create}
            </Button>
          </div>
        </form>
    </SideSheet>
  );
}
