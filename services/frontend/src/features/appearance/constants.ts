import type { SegmentedOption } from "@/components/ui/segmented";
import type { ButtonRadius, ButtonVariant } from "@/lib/theme/types";

export const BUTTON_VARIANT_OPTIONS: SegmentedOption<ButtonVariant>[] = [
  { value: "fill", label: "Fill" },
  { value: "outline", label: "Outline" },
  { value: "soft", label: "Soft" },
];

export const BUTTON_RADIUS_OPTIONS: SegmentedOption<ButtonRadius>[] = [
  { value: "md", label: "Rounded" },
  { value: "xl", label: "Round" },
  { value: "full", label: "Pill" },
];
