"use client";

import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import {
  buildPickerMonthCells,
  calendarMonthLabel,
  parseYmd,
} from "@/lib/calendar/calendar-grid";
import { formatYmdForDisplay } from "@/lib/calendar/format-date-display";
import { formatYerevanDate } from "@/lib/calendar/yerevan-date";
import { scheduleStateUpdate } from "@/lib/react/schedule-after-paint";

export type DatePickerFieldLabels = {
  placeholder: string;
  clear: string;
  today: string;
  weekdays: readonly string[];
};

type DatePickerFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  locale: string;
  labels: DatePickerFieldLabels;
  name?: string;
  id?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnSelect?: boolean;
  minDate?: string;
  maxDate?: string;
  isDateEnabled?: (date: string) => boolean;
  showClearToday?: boolean;
  footer?: ReactNode;
  renderTrigger?: (props: {
    id: string;
    open: boolean;
    disabled: boolean;
    onClick: () => void;
  }) => ReactNode;
};

function isWithinBounds(
  date: string,
  minDate?: string,
  maxDate?: string,
  isDateEnabled?: (date: string) => boolean,
): boolean {
  if (minDate && date < minDate) return false;
  if (maxDate && date > maxDate) return false;
  if (isDateEnabled && !isDateEnabled(date)) return false;
  return true;
}

const POPOVER_GAP_PX = 8;
const PANEL_WIDTH_PX = 320;
const VIEWPORT_PAD_PX = 12;

type PopoverPlacement = "bottom" | "top";

type PanelCoords = {
  top: number;
  left: number;
};

function resolvePanelCoords(
  triggerRect: DOMRect,
  panelHeight: number,
): PanelCoords {
  const spaceBelow = window.innerHeight - triggerRect.bottom - POPOVER_GAP_PX;
  const spaceAbove = triggerRect.top - POPOVER_GAP_PX;

  let placement: PopoverPlacement = "bottom";
  if (spaceBelow < panelHeight && spaceAbove >= panelHeight) {
    placement = "top";
  } else if (spaceBelow < panelHeight && spaceAbove > spaceBelow) {
    placement = "top";
  }

  const width = Math.min(
    PANEL_WIDTH_PX,
    window.innerWidth - VIEWPORT_PAD_PX * 2,
  );
  let left = triggerRect.left;
  left = Math.min(left, window.innerWidth - width - VIEWPORT_PAD_PX);
  left = Math.max(VIEWPORT_PAD_PX, left);

  const top =
    placement === "top"
      ? Math.max(
          VIEWPORT_PAD_PX,
          triggerRect.top - POPOVER_GAP_PX - panelHeight,
        )
      : triggerRect.bottom + POPOVER_GAP_PX;

  return { top, left };
}

/** Popover date field — portaled calendar so drawers do not clip it. */
export function DatePickerField({
  value,
  onChange,
  disabled = false,
  className = "",
  inputClassName = "",
  locale,
  labels,
  name,
  id,
  open: openProp,
  onOpenChange,
  closeOnSelect = true,
  minDate,
  maxDate,
  isDateEnabled,
  showClearToday = true,
  footer,
  renderTrigger,
}: DatePickerFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [openInternal, setOpenInternal] = useState(false);
  const [coords, setCoords] = useState<PanelCoords | null>(null);
  const [mounted, setMounted] = useState(false);
  const open = openProp ?? openInternal;
  const setOpen = onOpenChange ?? setOpenInternal;

  const initialParts = value
    ? parseYmd(value)
    : parseYmd(formatYerevanDate(new Date()));
  const [viewYear, setViewYear] = useState(initialParts.year);
  const [viewMonth, setViewMonth] = useState(initialParts.monthIndex);

  useEffect(() => {
    scheduleStateUpdate(setMounted, true);
  }, []);

  useEffect(() => {
    if (!value) return;
    const parts = parseYmd(value);
    scheduleStateUpdate(setViewYear, parts.year);
    scheduleStateUpdate(setViewMonth, parts.monthIndex);
  }, [value]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent): void {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen]);

  useLayoutEffect(() => {
    if (!open) {
      scheduleStateUpdate(setCoords, null);
      return;
    }

    function updateCoords(): void {
      const root = rootRef.current;
      const panel = panelRef.current;
      if (!root || !panel) return;

      setCoords(
        resolvePanelCoords(
          root.getBoundingClientRect(),
          panel.offsetHeight,
        ),
      );
    }

    updateCoords();
    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", updateCoords, true);
    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [open, viewYear, viewMonth, footer, showClearToday]);

  function shiftMonth(delta: number): void {
    const next = new Date(Date.UTC(viewYear, viewMonth + delta, 1));
    setViewYear(next.getUTCFullYear());
    setViewMonth(next.getUTCMonth());
  }

  function selectDate(date: string): void {
    if (!isWithinBounds(date, minDate, maxDate, isDateEnabled)) return;
    onChange(date);
    const parts = parseYmd(date);
    setViewYear(parts.year);
    setViewMonth(parts.monthIndex);
    if (closeOnSelect && !footer) {
      setOpen(false);
    }
  }

  function selectAdjacentDate(date: string): void {
    const parts = parseYmd(date);
    setViewYear(parts.year);
    setViewMonth(parts.monthIndex);
    selectDate(date);
  }

  const cells = buildPickerMonthCells(viewYear, viewMonth);
  const displayValue = value ? formatYmdForDisplay(value) : "";
  const triggerDisabled = disabled;

  const panelWidth = Math.min(
    PANEL_WIDTH_PX,
    typeof window !== "undefined"
      ? window.innerWidth - VIEWPORT_PAD_PX * 2
      : PANEL_WIDTH_PX,
  );

  const panelStyle: CSSProperties | undefined = coords
    ? {
        position: "fixed",
        top: coords.top,
        left: coords.left,
        width: panelWidth,
        zIndex: 300,
      }
    : {
        position: "fixed",
        top: 0,
        left: 0,
        width: panelWidth,
        zIndex: 300,
        visibility: "hidden",
      };

  const panel =
    open && mounted ? (
      <div
        ref={panelRef}
        role="dialog"
        aria-label={labels.placeholder}
        style={panelStyle}
        className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-medium capitalize text-gray-900">
            {calendarMonthLabel(viewYear, viewMonth, locale)}
          </p>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className="rounded p-1 text-gray-600 hover:bg-gray-100"
              aria-label="Previous month"
              onClick={() => shiftMonth(-1)}
            >
              <ChevronUp className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              className="rounded p-1 text-gray-600 hover:bg-gray-100"
              aria-label="Next month"
              onClick={() => shiftMonth(1)}
            >
              <ChevronDown className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
          {labels.weekdays.map((label) => (
            <div key={label} className="truncate py-1 font-medium">
              {label}
            </div>
          ))}
          {cells.map((cell) => {
            const isSelected = value === cell.date;
            const enabled = isWithinBounds(
              cell.date,
              minDate,
              maxDate,
              isDateEnabled,
            );
            return (
              <button
                key={`${cell.date}-${cell.inMonth ? "in" : "out"}`}
                type="button"
                disabled={!enabled}
                onClick={() =>
                  cell.inMonth
                    ? selectDate(cell.date)
                    : selectAdjacentDate(cell.date)
                }
                className={`h-10 rounded-md text-sm transition-colors ${
                  isSelected
                    ? "bg-brand font-semibold text-gray-900"
                    : cell.inMonth
                      ? enabled
                        ? "text-gray-900 hover:bg-gray-100"
                        : "cursor-not-allowed text-gray-300"
                      : enabled
                        ? "text-gray-400 hover:bg-gray-50"
                        : "cursor-not-allowed text-gray-300"
                }`}
              >
                {Number(cell.date.slice(-2))}
              </button>
            );
          })}
        </div>

        {footer ? (
          <div className="mt-3 border-t border-gray-100 pt-3">{footer}</div>
        ) : null}

        {showClearToday ? (
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-gray-100 pt-2 text-sm">
            <button
              type="button"
              className="font-medium text-gray-900 hover:underline"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              {labels.clear}
            </button>
            <button
              type="button"
              className="font-medium text-gray-900 hover:underline"
              onClick={() => {
                const today = formatYerevanDate(new Date());
                selectDate(today);
                if (closeOnSelect && !footer) {
                  setOpen(false);
                }
              }}
            >
              {labels.today}
            </button>
          </div>
        ) : null}
      </div>
    ) : null;

  return (
    <div ref={rootRef} className={`relative ${className}`.trim()}>
      {renderTrigger ? (
        renderTrigger({
          id: fieldId,
          open,
          disabled: triggerDisabled,
          onClick: () => {
            if (!triggerDisabled) setOpen(!open);
          },
        })
      ) : (
        <button
          id={fieldId}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={`flex h-11 w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-left text-sm shadow-sm transition-colors hover:border-gray-300 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60 ${inputClassName}`.trim()}
        >
          <CalendarDays
            className="h-4 w-4 shrink-0 text-gray-400"
            aria-hidden
          />
          <span className={displayValue ? "text-gray-900" : "text-gray-400"}>
            {displayValue || labels.placeholder}
          </span>
        </button>
      )}

      {name ? <input type="hidden" name={name} value={value} /> : null}

      {panel ? createPortal(panel, document.body) : null}
    </div>
  );
}
