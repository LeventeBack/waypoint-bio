import Link from "next/link";
import { PUBLIC_HOST } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";

interface WaypointBadgeProps {
  dark: boolean;
}

export function WaypointBadge({ dark }: WaypointBadgeProps) {
  const color = dark ? "rgba(255,255,255,0.55)" : "rgba(28,27,25,0.5)";
  const pill = dark ? "rgba(255,255,255,0.08)" : "rgba(28,27,25,0.05)";
  return (
    <Link
      href={ROUTES.register}
      style={{ color, background: pill }}
      className="flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[12px] font-semibold transition-opacity hover:opacity-80"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.6" stroke="currentColor" strokeWidth="2.6" />
        <circle cx="12" cy="12" r="3.1" fill="currentColor" />
      </svg>
      {PUBLIC_HOST}
    </Link>
  );
}
