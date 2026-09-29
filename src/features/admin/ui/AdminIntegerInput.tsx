"use client";

import {
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";

import { ADMIN_INPUT } from "@/features/admin/ui/admin-form-classes";

type AdminIntegerInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "inputMode"
> & {
  value: string;
  onValueChange: (value: string) => void;
};

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** How many digit characters appear in `value` before `index`. */
function digitCountBefore(value: string, index: number): number {
  let count = 0;
  const end = Math.min(index, value.length);
  for (let i = 0; i < end; i += 1) {
    if (value.charCodeAt(i) >= 48 && value.charCodeAt(i) <= 57) {
      count += 1;
    }
  }
  return count;
}

/**
 * Digits-only text field for admin money / qty inputs.
 * Restores caret after each change so typing mid-value does not jump to the end.
 */
export function AdminIntegerInput({
  value,
  onValueChange,
  className = ADMIN_INPUT,
  ...rest
}: AdminIntegerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaretRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const input = inputRef.current;
    const caret = pendingCaretRef.current;
    if (!input || caret == null) return;
    input.setSelectionRange(caret, caret);
    pendingCaretRef.current = null;
  }, [value]);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const input = event.target;
    const raw = input.value;
    const selectionStart = input.selectionStart ?? raw.length;
    const next = digitsOnly(raw);
    pendingCaretRef.current = Math.min(
      digitCountBefore(raw, selectionStart),
      next.length,
    );
    onValueChange(next);
  }

  return (
    <input
      {...rest}
      ref={inputRef}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      spellCheck={false}
      value={value}
      onChange={handleChange}
      className={className}
    />
  );
}
