import Link from "next/link";
import type { PropsWithChildren } from "react";
import { CenteredScreen } from "@/components/ui/centered-screen";

interface AuthScreenProps {
  title: string;
  subtitle: string;
  footerPrompt: string;
  footerLinkLabel: string;
  footerHref: string;
}

export function AuthScreen({
  title,
  subtitle,
  footerPrompt,
  footerLinkLabel,
  footerHref,
  children,
}: PropsWithChildren<AuthScreenProps>) {
  return (
    <CenteredScreen>
      <div className="w-full max-w-100">
        <div className="bg-surface border border-stroke rounded-2xl p-7 shadow-card">
          <h1 className="text-[20px] font-extrabold tracking-tight">{title}</h1>
          <p className="text-[13.5px] text-muted mt-1">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        <p className="text-center text-[13.5px] text-muted mt-5">
          {footerPrompt}{" "}
          <Link
            href={footerHref}
            className="font-semibold text-ink hover:text-accent transition-colors"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </CenteredScreen>
  );
}
