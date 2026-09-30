"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SideSheet } from "@/components/ui/SideSheet";
import { AdminIntegerInput } from "@/features/admin/ui/AdminIntegerInput";
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
import {
  isLocale,
  localeLabels,
  locales,
  type Locale,
} from "@/lib/i18n/config";

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

type LocaleDrafts = Record<Locale, string>;

function draftsFromTranslations(
  translations: Partial<Record<Locale, string>> | undefined,
  fallback = "",
): LocaleDrafts {
  return {
    hy: translations?.hy ?? fallback,
    en: translations?.en ?? fallback,
    ru: translations?.ru ?? fallback,
  };
}

function firstIncompleteLocale(
  countryDrafts: LocaleDrafts,
  cityDrafts: LocaleDrafts,
): Locale | null {
  for (const loc of locales) {
    if (countryDrafts[loc].trim() === "" || cityDrafts[loc].trim() === "") {
      return loc;
    }
  }
  return null;
}

function DeliveryLocationForm({
  locale,
  location,
  onClose,
}: DeliveryLocationFormProps) {
  const router = useRouter();
  const t = adminCopy(locale);
  const isEdit = location != null;
  const [activeLocale, setActiveLocale] = useState<Locale>(() =>
    isLocale(locale) ? locale : "hy",
  );
  const [countryDrafts, setCountryDrafts] = useState<LocaleDrafts>(() =>
    draftsFromTranslations(location?.countryTranslations),
  );
  const [cityDrafts, setCityDrafts] = useState<LocaleDrafts>(() =>
    draftsFromTranslations(location?.cityTranslations, location?.city ?? ""),
  );
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

        const missingLocale = firstIncompleteLocale(countryDrafts, cityDrafts);
        if (missingLocale) {
          setActiveLocale(missingLocale);
          setError(t.delivery.errors.translationsRequired);
          return;
        }

        const payload = {
          countryHy: countryDrafts.hy,
          countryEn: countryDrafts.en,
          countryRu: countryDrafts.ru,
          cityHy: cityDrafts.hy,
          cityEn: cityDrafts.en,
          cityRu: cityDrafts.ru,
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
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
            {t.delivery.fields.translations}
          </p>
          <div className="flex flex-wrap gap-2">
            {locales.map((loc) => {
              const selected = loc === activeLocale;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setActiveLocale(loc)}
                  className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                    selected
                      ? "bg-gray-900 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {localeLabels[loc]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={ADMIN_LABEL}>
              {t.delivery.fields.country} <span className="text-red-600">*</span>
            </span>
            <input
              value={countryDrafts[activeLocale]}
              onChange={(event) =>
                setCountryDrafts((current) => ({
                  ...current,
                  [activeLocale]: event.target.value,
                }))
              }
              placeholder={t.delivery.placeholders.country[activeLocale]}
              required
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>

          <label className="block">
            <span className={ADMIN_LABEL}>
              {t.delivery.fields.city} <span className="text-red-600">*</span>
            </span>
            <input
              value={cityDrafts[activeLocale]}
              onChange={(event) =>
                setCityDrafts((current) => ({
                  ...current,
                  [activeLocale]: event.target.value,
                }))
              }
              placeholder={t.delivery.placeholders.city[activeLocale]}
              required
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className={ADMIN_LABEL}>{t.delivery.fields.price}</span>
            <AdminIntegerInput
              required
              value={priceAmount}
              onValueChange={setPriceAmount}
              placeholder={t.delivery.placeholders.price}
              disabled={isPending}
            />
          </label>

          <label>
            <span className={ADMIN_LABEL}>{t.delivery.fields.freeFrom}</span>
            <AdminIntegerInput
              value={freeThresholdAmount}
              onValueChange={setFreeThresholdAmount}
              placeholder={t.delivery.placeholders.freeFrom}
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
