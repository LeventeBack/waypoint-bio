"use client";

import { Segmented } from "@/components/ui/segmented";
import { Toggle } from "@/components/ui/toggle";
import { useDashboard } from "@/features/dashboard/dashboard-provider";
import type { ButtonStyle } from "@/lib/theme/types";
import { BUTTON_RADIUS_OPTIONS, BUTTON_VARIANT_OPTIONS } from "../constants";
import { EditorSection } from "./editor-section";

export function ButtonStyleSection() {
  const { theme, saveTheme } = useDashboard();

  const setButton = (patch: Partial<ButtonStyle>) =>
    saveTheme({ ...theme, button: { ...theme.button, ...patch } });

  return (
    <EditorSection label="Buttons">
      <div className="flex flex-col gap-4 bg-surface border border-stroke rounded-2xl p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="text-[13.5px] font-semibold text-ink">Style</span>
          <Segmented
            value={theme.button.variant}
            options={BUTTON_VARIANT_OPTIONS}
            onChange={(variant) => setButton({ variant })}
          />
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="text-[13.5px] font-semibold text-ink">Corners</span>
          <Segmented
            value={theme.button.radius}
            options={BUTTON_RADIUS_OPTIONS}
            onChange={(radius) => setButton({ radius })}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[13.5px] font-semibold text-ink">Shadow</span>
          <Toggle
            value={theme.button.shadow}
            onChange={(shadow) => setButton({ shadow })}
            label="Button shadow"
          />
        </div>
      </div>
    </EditorSection>
  );
}
