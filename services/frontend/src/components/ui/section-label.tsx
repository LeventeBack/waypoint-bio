import type { PropsWithChildren } from "react";

export function SectionLabel({ children }: PropsWithChildren) {
  return (
    <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-faint">{children}</h3>
  );
}
