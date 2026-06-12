import { Avatar } from "@/components/ui/avatar";
import { getBackground, getTextColors, linkStyle } from "@/lib/theme/utils";
import type { PublicProfileUI } from "../types";
import { WaypointBadge } from "./waypoint-badge";

interface PublicProfileProps {
  profile: PublicProfileUI;
  dense?: boolean;
}

export function PublicProfile({ profile, dense = false }: PublicProfileProps) {
  const bg = getBackground(profile.theme.bgId);
  const colors = getTextColors(bg);

  return (
    <div style={{ background: bg.css }} className="min-h-full w-full flex flex-col items-center">
      <div
        className={`w-full max-w-115 flex-1 flex flex-col items-center px-6 ${
          dense ? "pt-16 pb-8" : "pt-20 pb-10"
        }`}
      >
        <Avatar
          src={profile.avatarUrl}
          name={profile.username}
          size={dense ? 86 : 96}
          ringColor={colors.avatarRing}
        />
        <h1
          style={{ color: colors.heading }}
          className="mt-5 text-[22px] font-extrabold tracking-tight leading-none"
        >
          {profile.username}
        </h1>
        <div style={{ color: colors.subtext }} className="font-mono text-[13px] mt-2">
          {profile.handle}
        </div>
        {profile.bio && (
          <p
            style={{ color: colors.subtext }}
            className="text-center text-[15px] leading-relaxed mt-3.5 max-w-85 text-pretty"
          >
            {profile.bio}
          </p>
        )}
        <div className="w-full flex flex-col gap-3.5 mt-9">
          {profile.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="wp-link h-14 w-full px-5 font-semibold text-[15px] flex items-center gap-3 text-left"
              style={linkStyle(bg, profile.theme.button)}
              title={link.url}
            >
              <span className="flex-1 truncate text-center">{link.title}</span>
            </a>
          ))}
        </div>
        <div className="mt-auto pt-14 pb-2">
          <WaypointBadge dark={bg.dark} />
        </div>
      </div>
    </div>
  );
}
