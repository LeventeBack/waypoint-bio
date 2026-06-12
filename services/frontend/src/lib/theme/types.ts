export type ButtonVariant = "fill" | "outline" | "soft";
export type ButtonRadius = "md" | "xl" | "full";

export interface ButtonStyle {
  variant: ButtonVariant;
  radius: ButtonRadius;
  shadow: boolean;
}

export interface PageTheme {
  bgId: string;
  button: ButtonStyle;
}

export interface Background {
  id: string;
  name: string;
  css: string;
  dark: boolean;
}

export interface ThemePreset extends PageTheme {
  id: string;
  name: string;
}

export interface ThemeTextColors {
  heading: string;
  subtext: string;
  avatarRing: string;
}
