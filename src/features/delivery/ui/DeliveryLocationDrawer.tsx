"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SideSheet } from "@/components/ui/SideSheet";
import {
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "@/features/admin/ui/admin-form-classes";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import {
  createDeliveryLocationAction,
  updateDeliveryLocationAction,
} from "@/features/delivery/application/manage-delivery";
import type { AdminDeliveryLocation } from "@/features/delivery/application/queries";

type DeliveryLocationDrawerProps = {
  locale: string;
  open: boolean;
  onClose: () => void;
  location?: AdminDeliveryLocation | null;
};

type DeliveryLocationFormProps = {
  locale: string;
  location: AdminDeliveryLocation | null;
  onClose: () => void;
};

function DeliveryLocationForm({
  locale,
  location,
  onClose,
}: DeliveryLocationFormProps) {
  const router = useRouter();
  const t = adminCopy(locale);
  const isEdit = location != null;
  const [country, setCountry] = useState(location?.country ?? "");
  const [city, setCity] = useState(location?.city ?? "");
  const [priceAmount, setPriceAmount] = useState(
    location ? String(location.priceAmount) : "",
  );
  const [freeThresholdAmount, setFreeThresholdAmount] = useState(
    location?.freeThresholdAmount != null
      ? String(location.freeThresholdAmount)
      : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();

        const payload = {
          country,
          city,
          priceAmount: Number(priceAmount),
          freeThresholdAmount:
            freeThresholdAmount.trim() === ""
              ? null
              : Number(freeThresholdAmount),
        };

        startTransition(async () => {
          setError(null);
          const result =
            isEdit && location
              ? await updateDeliveryLocationAction(
                  locale,
                  location.id,
                  payload,
                )
              : await createDeliveryLocationAction(locale, payload);

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className={ADMIN_LABEL}>{t.delivery.fields.country}</span>
            <input
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              placeholder={t.delivery.placeholders.country}
              required
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>

          <label>
            <span className={ADMIN_LABEL}>{t.delivery.fields.city}</span>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder={t.delivery.placeholders.city}
              required
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className={ADMIN_LABEL}>{t.delivery.fields.price}</span>
            <input
              type="number"
              min={0}
              step={1}
              required
              value={priceAmount}
              onChange={(event) => setPriceAmount(event.target.value)}
              placeholder={t.delivery.placeholders.price}
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>

          <label>
            <span className={ADMIN_LABEL}>{t.delivery.fields.freeFrom}</span>
            <input
              type="number"
              min={0}
              step={1}
              value={freeThresholdAmount}
              onChange={(event) => setFreeThresholdAmount(event.target.value)}
              placeholder={t.delivery.placeholders.freeFrom}
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>
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
          {isPending ? t.common.saving : t.common.save}
        </Button>
      </div>
    </form>
  );
}

export function DeliveryLocationDrawer({
  locale,
  open,
  onClose,
  location = null,
}: DeliveryLocationDrawerProps) {
  const formKey = location?.id ?? "new";
  const t = adminCopy(locale);

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      ariaLabel={location ? t.delivery.drawer.editTitle : t.delivery.drawer.createTitle}
    >
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {location ? t.delivery.drawer.editTitle : t.delivery.drawer.createTitle}
        </h2>
      </div>

      <DeliveryLocationForm
        key={formKey}
        locale={locale}
        location={location}
        onClose={onClose}
      />
    </SideSheet>
  );
}
