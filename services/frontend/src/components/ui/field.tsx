import type { PropsWithChildren } from "react";

export function inputClass(hasError: boolean): string {
  return `w-full h-11 px-3.5 rounded-[10px] bg-base border text-[14.5px] text-ink placeholder:text-faint focus:outline-none transition-shadow ${
    hasError
      ? "border-red-500/70 focus:ring-[3px] focus:ring-red-500/20"
      : "border-stroke-strong focus:border-accent focus:ring-[3px] focus:ring-accent-soft"
  }`;
}

interface FieldProps {
  label: string;
  error?: string | null;
  hint?: string | null;
}

export function Field({ label, error, hint, children }: PropsWithChildren<FieldProps>) {
  return (
    <label className="block">
      <span className="block text-[13px] font-semibold text-muted mb-1.5">{label}</span>
      {children}
      {error ? (
        <span className="block text-[12.5px] text-red-400 mt-1.5">{error}</span>
      ) : hint ? (
        <span className="block text-[12.5px] text-faint mt-1.5">{hint}</span>
      ) : null}
    </label>
  );
}
