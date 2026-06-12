"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icons";
import { logoutAction } from "@/features/auth/actions";
import { ROUTES } from "@/lib/routes";
import { useDashboard } from "../dashboard-provider";

export function AccountMenu() {
  const { profile } = useDashboard();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 w-full px-2 h-11 rounded-xl hover:bg-white/5 transition-colors"
      >
        <Avatar src={profile.avatarUrl} name={profile.username} size={28} />
        <span className="flex-1 min-w-0 text-left text-[13.5px] font-semibold text-ink truncate">
          {profile.username}
        </span>
        <span className="text-faint">
          <Icon name="chevdown" size={14} />
        </span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute z-40 left-0 w-56 bg-raised border border-stroke rounded-xl shadow-pop p-1.5 bottom-full mb-2">
            <div className="px-2.5 py-2">
              <div className="text-[13.5px] font-semibold text-ink">{profile.username}</div>
              <div className="font-mono text-[11.5px] text-faint mt-0.5">@{profile.username}</div>
            </div>
            <div className="h-px bg-stroke my-1" />
            <a
              href={ROUTES.publicProfile(profile.username)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full px-2.5 h-9 rounded-lg text-[13px] font-semibold text-muted hover:text-ink hover:bg-white/5 transition-colors"
            >
              <Icon name="external" size={14} /> View public page
            </a>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-2.5 w-full px-2.5 h-9 rounded-lg text-[13px] font-semibold text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <Icon name="logout" size={14} /> Log out
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
