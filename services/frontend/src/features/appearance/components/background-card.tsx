"use client";

import { Icon } from "@/components/ui/icons";
import type { Background } from "@/lib/theme/types";

interface BackgroundCardProps {
  background: Background;
  active: boolean;
  onClick: () => void;
}

export function BackgroundCard({ background, active, onClick }: BackgroundCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-1 transition-all ${
        active
          ? "border-accent ring-[3px] ring-accent-soft"
          : "border-stroke hover:border-stroke-strong"
      }`}
      title={background.name}
    >
      <div
        className="h-12 rounded-lg flex items-center justify-center"
        style={{ background: background.css }}
      >
        {active && (
          <span className={background.dark ? "text-white/90" : "text-black/70"}>
            <Icon name="check" size={16} />
          </span>
        )}
      </div>
      <div
        className={`text-[11.5px] font-semibold text-center py-1 ${active ? "text-ink" : "text-faint"}`}
      >
        {background.name}
      </div>
    </button>
  );
}
