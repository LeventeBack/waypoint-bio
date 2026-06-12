import type { PropsWithChildren } from "react";
import { Logo } from "./logo";

const GLOW_BACKGROUND =
  "radial-gradient(640px 320px at 50% -60px, var(--c-accent-soft), transparent), var(--c-base)";

export function CenteredScreen({ children }: PropsWithChildren) {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center gap-7 px-6 py-16"
      style={{ background: GLOW_BACKGROUND }}
    >
      <Logo size={26} />
      {children}
    </main>
  );
}
