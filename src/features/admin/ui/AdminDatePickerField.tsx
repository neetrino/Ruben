"use client";

import {
  DatePickerField,
  type DatePickerFieldLabels,
} from "@/components/ui/DatePickerField";
import { ADMIN_INPUT } from "@/features/admin/ui/admin-form-classes";
import { getAdminDatePickerLabels } from "@/features/admin/ui/admin-date-picker-labels";
import type { AdminDictionary } from "@/lib/i18n/get-dictionary";

type AdminDatePickerFieldProps = {
  value: string;
  onChange: (value: string) => void;
  locale: string;
  common: AdminDictionary["common"];
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  name?: string;
  id?: string;
  minDate?: string;
  maxDate?: string;
  isDateEnabled?: (date: string) => boolean;
  labels?: Partial<DatePickerFieldLabels>;
};

/** Admin-styled date field with shared popover calendar. */
export function AdminDatePickerField({
  locale,
  common,
  inputClassName = ADMIN_INPUT,
  labels,
  ...props
}: AdminDatePickerFieldProps) {
  return (
    <DatePickerField
      {...props}
      locale={locale}
      inputClassName={inputClassName}
      labels={{ ...getAdminDatePickerLabels(common), ...labels }}
    />
  );
}
