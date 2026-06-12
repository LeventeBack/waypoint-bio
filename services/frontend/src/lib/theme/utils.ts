import type { CSSProperties } from "react";
import { BACKGROUNDS, BUTTON_RADIUSES, BUTTON_VARIANTS, DEFAULT_THEME } from "./constants";
import type {
  Background,
  ButtonRadius,
  ButtonStyle,
  ButtonVariant,
  PageTheme,
  ThemeTextColors,
} from "./types";

export function getBackground(bgId: string): Background {
  return BACKGROUNDS.find((b) => b.id === bgId) ?? BACKGROUNDS[0];
}

export function encodeTheme(theme: PageTheme): string {
  const { bgId, button } = theme;
  return `${bgId}:${button.variant}:${button.radius}:${button.shadow ? "1" : "0"}`;
}

export function decodeTheme(encoded: string | null | undefined): PageTheme {
  if (!encoded) return DEFAULT_THEME;
  const [bgId, variant, radius, shadow] = encoded.split(":");
  if (!BACKGROUNDS.some((b) => b.id === bgId)) return DEFAULT_THEME;
  return {
    bgId,
    button: {
      variant: BUTTON_VARIANTS.includes(variant as ButtonVariant)
        ? (variant as ButtonVariant)
        : DEFAULT_THEME.button.variant,
      radius: BUTTON_RADIUSES.includes(radius as ButtonRadius)
        ? (radius as ButtonRadius)
        : DEFAULT_THEME.button.radius,
      shadow: shadow === "1",
    },
  };
}

export function getTextColors(bg: Background): ThemeTextColors {
  return bg.dark
    ? {
        heading: "#f7f7f5",
        subtext: "rgba(247,247,245,0.62)",
        avatarRing: "rgba(255,255,255,0.16)",
      }
    : {
        heading: "#1c1b19",
        subtext: "rgba(28,27,25,0.58)",
        avatarRing: "rgba(28,27,25,0.1)",
      };
}

const LINK_RADII = { md: 12, xl: 20, full: 999 };
const MINI_LINK_RADII = { md: 3, xl: 5, full: 999 };

export function linkStyle(bg: Background, button: ButtonStyle, mini = false): CSSProperties {
  const radius = mini ? MINI_LINK_RADII[button.radius] : LINK_RADII[button.radius];
  const inkCol = bg.dark ? "#ffffff" : "#1c1b19";
  const s: CSSProperties = { borderRadius: radius };
  if (button.variant === "fill") {
    s.background = bg.dark ? "#ffffff" : "#1d1c1a";
    s.color = bg.dark ? "#1c1b19" : "#ffffff";
  } else if (button.variant === "outline") {
    s.border = `${mini ? 1 : 1.5}px solid ${bg.dark ? "rgba(255,255,255,0.55)" : "rgba(28,27,25,0.45)"}`;
    s.color = inkCol;
    s.background = "transparent";
  } else {
    s.background = bg.dark ? "rgba(255,255,255,0.13)" : "rgba(25,25,20,0.07)";
    s.color = inkCol;
    if (!mini) s.backdropFilter = "blur(8px)";
  }
  if (button.shadow && !mini) {
    s.boxShadow = bg.dark
      ? "0 10px 28px -6px rgba(0,0,0,0.5)"
      : "0 12px 26px -10px rgba(40,32,25,0.35)";
  }
  return s;
}
