"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { PUBLIC_HOST } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import { COPY_FEEDBACK_MS } from "../constants";
import { useDashboard } from "../dashboard-provider";
import { PhonePreview } from "./phone-preview";

export function PreviewPane() {
  const { profile } = useDashboard();
  const [copied, setCopied] = useState(false);
  const copiedTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const displayUrl = `${PUBLIC_HOST}/${profile.username}`;

  useEffect(() => () => clearTimeout(copiedTimeout.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${ROUTES.publicProfile(profile.username)}`,
      );
      setCopied(true);
      clearTimeout(copiedTimeout.current);
      copiedTimeout.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    } catch {
      // Clipboard unavailable (e.g. insecure context)
    }
  };

  return (
    <aside className="hidden lg:flex w-97 shrink-0 border-l border-stroke flex-col items-center overflow-y-auto py-6 px-6 gap-5 bg-black/20">
      <div className="w-full flex flex-col gap-3">
        <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-faint flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live preview
        </span>
        <div className="w-full flex items-center gap-1 bg-surface border border-stroke rounded-full h-9 pl-3.5 pr-1.5">
          <span className="flex-1 font-mono text-[12px] text-muted truncate">{displayUrl}</span>
          <button
            onClick={copy}
            className="p-1.5 rounded-full text-faint hover:text-ink transition-colors"
            title="Copy URL"
            aria-label="Copy URL"
          >
            {copied ? (
              <span className="text-emerald-400">
                <Icon name="check" size={14} />
              </span>
            ) : (
              <Icon name="copy" size={14} />
            )}
          </button>
          <a
            href={ROUTES.publicProfile(profile.username)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full text-faint hover:text-ink transition-colors"
            title="Open public page"
            aria-label="Open public page"
          >
            <Icon name="external" size={14} />
          </a>
        </div>
      </div>
      <PhonePreview />
    </aside>
  );
}
