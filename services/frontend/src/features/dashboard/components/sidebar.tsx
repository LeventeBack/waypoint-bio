"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { NAV_ITEMS } from "../constants";
import { AccountMenu } from "./account-menu";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-stroke flex flex-col px-3.5 py-5">
      <div className="px-2">
        <Logo size={22} />
      </div>
      <nav className="flex flex-col gap-1 mt-8">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 h-10 px-3 rounded-lg text-[14px] font-semibold transition-colors ${
                active ? "bg-raised text-ink" : "text-muted hover:text-ink hover:bg-white/4"
              }`}
            >
              <span className={active ? "text-accent" : "text-faint"}>
                <Icon name={item.icon} size={16} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto">
        <AccountMenu />
      </div>
    </aside>
  );
}
