"use client";

import { useDashboard } from "@/features/dashboard/dashboard-provider";
import { BACKGROUNDS } from "@/lib/theme/constants";
import { BackgroundCard } from "./background-card";
import { EditorSection } from "./editor-section";

export function BackgroundSection() {
  const { theme, saveTheme } = useDashboard();

  return (
    <EditorSection label="Background">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {BACKGROUNDS.map((bg) => (
          <BackgroundCard
            key={bg.id}
            background={bg}
            active={theme.bgId === bg.id}
            onClick={() => saveTheme({ ...theme, bgId: bg.id })}
          />
        ))}
      </div>
    </EditorSection>
  );
}
