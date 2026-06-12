import type { Background, ButtonRadius, ButtonVariant, PageTheme, ThemePreset } from "./types";

export const BACKGROUNDS: Background[] = [
  { id: "ink", name: "Ink", css: "#16181d", dark: true },
  { id: "paper", name: "Paper", css: "#f5f4f0", dark: false },
  { id: "sage", name: "Sage", css: "#e7ece5", dark: false },
  {
    id: "dusk",
    name: "Dusk",
    css: "linear-gradient(168deg, #1e2240 0%, #41295c 58%, #683d62 100%)",
    dark: true,
  },
  {
    id: "dawn",
    name: "Dawn",
    css: "linear-gradient(165deg, #faf1e9 0%, #f3dfdc 52%, #dee3f3 100%)",
    dark: false,
  },
  {
    id: "pine",
    name: "Pine",
    css: "linear-gradient(160deg, #0c2b21 0%, #1c4a37 100%)",
    dark: true,
  },
];

export const PRESETS: ThemePreset[] = [
  {
    id: "mono",
    name: "Mono",
    bgId: "ink",
    button: { variant: "fill", radius: "full", shadow: false },
  },
  {
    id: "editorial",
    name: "Editorial",
    bgId: "paper",
    button: { variant: "outline", radius: "md", shadow: false },
  },
  {
    id: "dusk",
    name: "Dusk",
    bgId: "dusk",
    button: { variant: "soft", radius: "full", shadow: false },
  },
  {
    id: "dawn",
    name: "Dawn",
    bgId: "dawn",
    button: { variant: "fill", radius: "xl", shadow: true },
  },
  {
    id: "pine",
    name: "Pine",
    bgId: "pine",
    button: { variant: "outline", radius: "full", shadow: false },
  },
];

export const DEFAULT_THEME: PageTheme = PRESETS[0];

export const BUTTON_VARIANTS: ButtonVariant[] = ["fill", "outline", "soft"];
export const BUTTON_RADIUSES: ButtonRadius[] = ["md", "xl", "full"];
