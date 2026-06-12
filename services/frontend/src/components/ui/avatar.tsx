interface AvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  ringColor?: string;
}

const INITIALS_FONT_RATIO = 0.36;
const MAX_INITIALS = 2;

function getInitials(name: string): string {
  return (name || "?")
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, MAX_INITIALS)
    .join("")
    .toUpperCase();
}

export function Avatar({ src, name, size = 40, ringColor }: AvatarProps) {
  const ring = ringColor ? { boxShadow: `0 0 0 3px ${ringColor}` } : undefined;

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size, ...ring }}
        className="rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * INITIALS_FONT_RATIO),
        ...ring,
        background:
          "linear-gradient(135deg, var(--c-accent), color-mix(in oklab, var(--c-accent) 55%, #14161f))",
      }}
      className="rounded-full flex items-center justify-center font-bold text-white select-none shrink-0"
    >
      {getInitials(name)}
    </div>
  );
}
