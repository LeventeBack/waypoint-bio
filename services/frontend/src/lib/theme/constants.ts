import type { Background, ButtonRadius, ButtonVariant, PageTheme, ThemePreset } from "./types";

export const BACKGROUNDS: Background[] = [
  { id: "ink", name: "Ink", css: "#16181d", dark: true },
  { id: "slate", name: "Slate", css: "#252a34", dark: true },
  { id: "ocean", name: "Ocean", css: "#122c44", dark: true },
  { id: "wine", name: "Wine", css: "#3a1622", dark: true },
  { id: "paper", name: "Paper", css: "#f5f4f0", dark: false },
  { id: "sand", name: "Sand", css: "#ece3d2", dark: false },
  { id: "sage", name: "Sage", css: "#e7ece5", dark: false },
  { id: "blush", name: "Blush", css: "#f6e3e0", dark: false },
  { id: "lavender", name: "Lavender", css: "#e8e6f4", dark: false },
  {
    id: "ember",
    name: "Ember",
    css: "linear-gradient(168deg, #2a0e13 0%, #6e1f26 55%, #a8453a 100%)",
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
    id: "ember",
    name: "Ember",
    bgId: "ember",
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
