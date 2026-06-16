"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Icon } from "@/components/ui/icons";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      aria-label="Refresh analytics"
      className="font-mono text-[12px] text-muted hover:text-ink bg-surface border border-stroke rounded-full h-8 px-3.5 inline-flex items-center gap-1.5 transition-colors disabled:opacity-60 disabled:pointer-events-none"
    >
      <Icon name="refresh" size={13} className={isPending ? "animate-spin" : ""} />
      {isPending ? "Refreshing" : "Refresh"}
    </button>
  );
}
