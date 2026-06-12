import type { PropsWithChildren } from "react";
import { SectionLabel } from "@/components/ui/section-label";

interface EditorSectionProps {
  label: string;
}

export function EditorSection({ label, children }: PropsWithChildren<EditorSectionProps>) {
  return (
    <section className="mt-9">
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}
