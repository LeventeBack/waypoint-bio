import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const SIZES = {
  sm: "h-8 px-3 rounded-lg text-[13px]",
  md: "h-10 px-4 rounded-[10px] text-[14px]",
  lg: "h-11 px-5 rounded-xl text-[14.5px] w-full",
};

const VARIANTS = {
  primary: "bg-accent hover:bg-accent-hover text-accent-on",
  outline: "border border-stroke-strong text-ink hover:bg-white/5",
  ghost: "text-muted hover:text-ink hover:bg-white/5",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors select-none disabled:opacity-50 disabled:pointer-events-none ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
