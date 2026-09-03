"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { AdminDatePickerField } from "@/features/admin/ui/AdminDatePickerField";
import { ADMIN_LABEL } from "@/features/admin/ui/admin-form-classes";
import { ADMIN_CARD_CLASS } from "@/features/admin/ui/admin-ui";
import { adminCopy } from "@/features/admin/ui/resolve-admin-locale";
import {
  ANALYTICS_PERIOD_PRESETS,
  formatAnalyticsDisplayDate,
  rangeForAnalyticsPeriod,
  type AnalyticsPeriodPreset,
} from "@/features/analytics/domain/date-range";

type AnalyticsPeriodCardProps = {
  locale: string;
  from: string;
  to: string;
  preset: AnalyticsPeriodPreset;
  exportQuery: string;
  rangeInvalid: boolean;
};

function AnalyticsPeriodCardForm({
  locale,
  from,
  to,
  preset,
  exportQuery,
  rangeInvalid,
}: AnalyticsPeriodCardProps) {
  const router = useRouter();
  const t = adminCopy(locale);
  const [pending, startTransition] = useTransition();
  const [forceCustom, setForceCustom] = useState(preset === "custom");
  const [customFrom, setCustomFrom] = useState(from);
  const [customTo, setCustomTo] = useState(to);
  const selectedPreset: AnalyticsPeriodPreset = forceCustom
    ? "custom"
    : preset;

  const presetLabel = (next: AnalyticsPeriodPreset): string => {
    const map: Record<AnalyticsPeriodPreset, string> = {
      last_7_days: t.analytics.period.last7Days,
      last_30_days: t.analytics.period.last30Days,
      last_90_days: t.analytics.period.last90Days,
      this_month: t.analytics.period.thisMonth,
      custom: t.analytics.period.customRange,
    };
    return map[next];
  };

  function navigate(nextFrom: string, nextTo: string): void {
    const params = new URLSearchParams({ from: nextFrom, to: nextTo });
    setForceCustom(false);
    startTransition(() => {
      router.push(`/${locale}/admin/analytics?${params.toString()}`);
    });
  }

  function onPeriodChange(value: string): void {
    const next = value as AnalyticsPeriodPreset;
    if (next === "custom") {
      setForceCustom(true);
      return;
    }
    const range = rangeForAnalyticsPeriod(next);
    navigate(range.from, range.to);
  }

  function onCustomSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!customFrom || !customTo) {
      return;
    }
    navigate(customFrom, customTo);
  }

  return (
    <div className={`mb-3 ${ADMIN_CARD_CLASS} p-4 sm:p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {t.analytics.period.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <SelectDropdown
              ariaLabel={t.analytics.period.aria}
              value={selectedPreset}
              options={ANALYTICS_PERIOD_PRESETS.map((option) => ({
                label: presetLabel(option),
                value: option,
              }))}
              disabled={pending}
              deferChange={false}
              className="w-auto min-w-[11rem] shrink-0"
              onValueChange={onPeriodChange}
            />
            <p className="text-sm font-medium text-gray-700">
              {formatAnalyticsDisplayDate(from)} –{" "}
              {formatAnalyticsDisplayDate(to)}
            </p>
          </div>
        </div>
        <a
          href={`/api/exports/admin/analytics?${exportQuery}`}
          className="rounded-[12px] px-3 py-1.5 text-xs font-medium text-black ring-1 ring-black/15 hover:bg-[color-mix(in_srgb,var(--brand)_12%,white)]"
        >
          {t.analytics.period.downloadCsv}
        </a>
      </div>

      {selectedPreset === "custom" ? (
        <form
          onSubmit={onCustomSubmit}
          className="mt-3 flex flex-wrap items-end gap-3"
        >
          <label className="min-w-[140px] flex-1">
            <span className={ADMIN_LABEL}>{t.analytics.period.from}</span>
            <AdminDatePickerField
              name="from"
              value={customFrom}
              onChange={setCustomFrom}
              disabled={pending}
              locale={locale}
              common={t.common}
            />
          </label>
          <label className="min-w-[140px] flex-1">
            <span className={ADMIN_LABEL}>{t.analytics.period.to}</span>
            <AdminDatePickerField
              name="to"
              value={customTo}
              onChange={setCustomTo}
              disabled={pending}
              locale={locale}
              common={t.common}
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="h-11 shrink-0 rounded-2xl bg-gray-900 px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {t.analytics.period.apply}
          </button>
        </form>
      ) : null}

      {rangeInvalid ? (
        <p className="mt-3 text-sm text-red-700">
          {t.analytics.period.invalidRange}
        </p>
      ) : null}
    </div>
  );
}

export function AnalyticsPeriodCard(props: AnalyticsPeriodCardProps) {
  return (
    <AnalyticsPeriodCardForm
      key={`${props.from}-${props.to}-${props.preset}`}
      {...props}
    />
  );
}
