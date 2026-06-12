import type { PageTheme, ThemePreset } from "@/lib/theme/types";

export function matchesPreset(theme: PageTheme, preset: ThemePreset): boolean {
  return (
    theme.bgId === preset.bgId &&
    theme.button.variant === preset.button.variant &&
    theme.button.radius === preset.button.radius &&
    theme.button.shadow === preset.button.shadow
  );
}
