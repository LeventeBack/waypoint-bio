import type { JSX } from "react";

const ICON_PATHS = {
  list: (
    <g>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h10" />
    </g>
  ),
  swatch: (
    <g>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
    </g>
  ),
  chart: (
    <g>
      <path d="M5 19v-8" />
      <path d="M12 19V5" />
      <path d="M19 19v-5" />
    </g>
  ),
  plus: (
    <g>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </g>
  ),
  trash: (
    <g>
      <path d="M5 7h14" />
      <path d="M10 7V5h4v2" />
      <path d="M8 7l1 12h6l1-12" />
    </g>
  ),
  copy: (
    <g>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </g>
  ),
  check: <path d="M5 13l4 4L19 7" />,
  chevdown: <path d="M6 9l6 6 6-6" />,
  logout: (
    <g>
      <path d="M9 4H5v16h4" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H9" />
    </g>
  ),
  external: (
    <g>
      <path d="M7 17L17 7" />
      <path d="M9 7h8v8" />
    </g>
  ),
  eye: (
    <g>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
      <circle cx="12" cy="12" r="3" />
    </g>
  ),
  x: (
    <g>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </g>
  ),
  edit: (
    <g>
      <path d="M4 20l1.2-4.2L16 5l3 3L8.2 18.8 4 20z" />
    </g>
  ),
  refresh: (
    <g>
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <path d="M20 4v4h-4" />
    </g>
  ),
} satisfies Record<string, JSX.Element>;

export type IconName = keyof typeof ICON_PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

interface GripIconProps {
  size?: number;
  className?: string;
}

export function GripIcon({ size = 15, className = "" }: GripIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="9" cy="5" r="1.7" />
      <circle cx="15" cy="5" r="1.7" />
      <circle cx="9" cy="12" r="1.7" />
      <circle cx="15" cy="12" r="1.7" />
      <circle cx="9" cy="19" r="1.7" />
      <circle cx="15" cy="19" r="1.7" />
    </svg>
  );
}
