"use client";

import type { ThemePreset } from "@/lib/theme/types";
import { getBackground, linkStyle } from "@/lib/theme/utils";

const PREVIEW_LINK_COUNT = 3;

interface PresetCardProps {
  preset: ThemePreset;
  active: boolean;
  onClick: () => void;
}

export function PresetCard({ preset, active, onClick }: PresetCardProps) {
  const bg = getBackground(preset.bgId);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-1.5 text-left transition-all ${
        active
          ? "border-accent ring-[3px] ring-accent-soft"
          : "border-stroke hover:border-stroke-strong"
      }`}
    >
      <div
        className="rounded-[10px] h-25 flex flex-col items-center justify-center gap-2 px-4"
        style={{ background: bg.css }}
      >
        <div
          className="w-5 h-5 rounded-full mb-0.5"
          style={{ background: bg.dark ? "rgba(255,255,255,0.85)" : "rgba(25,25,20,0.8)" }}
        />
        {Array.from({ length: PREVIEW_LINK_COUNT }, (_, i) => (
          <div key={i} className="w-full h-4" style={linkStyle(bg, preset.button, true)} />
        ))}
      </div>
      <div
        className={`text-[12px] font-semibold px-1.5 py-1.5 ${active ? "text-ink" : "text-muted"}`}
      >
        {preset.name}
      </div>
    </button>
  );
}
