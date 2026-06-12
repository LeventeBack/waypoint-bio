import type { IconName } from "@/components/ui/icons";
import { ROUTES } from "@/lib/routes";

export const NAV_ITEMS: { href: string; label: string; icon: IconName }[] = [
  { href: ROUTES.dashboardLinks, label: "Links", icon: "list" },
  { href: ROUTES.dashboardAppearance, label: "Appearance", icon: "swatch" },
  { href: ROUTES.dashboardAnalytics, label: "Analytics", icon: "chart" },
];

export const DEVICE_WIDTH = 402;
export const DEVICE_HEIGHT = 874;

export const PREVIEW_DEFAULT_SCALE = 0.56;
export const PREVIEW_MIN_SCALE = 0.42;
export const PREVIEW_MAX_SCALE = 0.62;
export const PREVIEW_CHROME_HEIGHT = 215;

export const COPY_FEEDBACK_MS = 1400;
