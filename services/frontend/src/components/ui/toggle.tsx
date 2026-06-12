"use client";

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}

export function Toggle({ value, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label || "Toggle"}
      onClick={() => onChange(!value)}
      className={`relative w-8.5 h-5 rounded-full transition-colors shrink-0 ${
        value ? "bg-accent" : "bg-white/10 shadow-[inset_0_0_0_1px_var(--c-stroke-strong)]"
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-150 ${
          value ? "left-4" : "left-0.5"
        }`}
      />
    </button>
  );
}
