"use client";

import { useDashboard } from "@/features/dashboard/dashboard-provider";
import { PRESETS } from "@/lib/theme/constants";
import { matchesPreset } from "../utils";
import { EditorSection } from "./editor-section";
import { PresetCard } from "./preset-card";

export function PresetSection() {
  const { theme, setThemeLocal } = useDashboard();

  return (
    <EditorSection label="Presets">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5">
        {PRESETS.map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            active={matchesPreset(theme, preset)}
            onClick={() => setThemeLocal({ bgId: preset.bgId, button: { ...preset.button } })}
          />
        ))}
      </div>
    </EditorSection>
  );
}
