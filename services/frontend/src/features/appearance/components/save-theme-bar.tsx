"use client";

import { SaveBar } from "@/components/ui/save-bar";
import { useDashboard } from "@/features/dashboard/dashboard-provider";

export function SaveThemeBar() {
  const { themeDirty, saveTheme, resetTheme } = useDashboard();

  return <SaveBar visible={themeDirty} onSave={saveTheme} onReset={resetTheme} />;
}
