interface LogoProps {
  size?: number;
  withWord?: boolean;
}

export function Logo({ size = 22, withWord = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.6" stroke="var(--c-accent)" strokeWidth="2.6" />
        <circle cx="12" cy="12" r="3.1" fill="var(--c-accent)" />
      </svg>
      {withWord && (
        <span className="font-extrabold tracking-tight text-[17px] text-ink leading-none">
          waypoint<span className="text-faint font-bold">.bio</span>
        </span>
      )}
    </div>
  );
}
