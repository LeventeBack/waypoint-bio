import type { Metadata } from "next";
import { decodeTheme } from "@/lib/theme/utils";
import type { ProfileWithLinks, PublicProfileUI } from "./types";

export function formatPublicProfileUI(profile: ProfileWithLinks): PublicProfileUI {
  return {
    username: profile.username,
    handle: `@${profile.username}`,
    bio: profile.bio?.trim() ? profile.bio : null,
    avatarUrl: profile.avatarUrl,
    theme: decodeTheme(profile.theme),
    links: profile.links
      .filter((link) => link.title.trim())
      .map(({ id, title, url }) => ({ id, title, url })),
  };
}

export function buildProfileMetadata(profile: ProfileWithLinks): Metadata {
  const title = `@${profile.username} — Waypoint Bio`;
  const description =
    profile.bio?.trim() || `All of @${profile.username}'s links in one place, on Waypoint Bio.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      ...(profile.avatarUrl && { images: [{ url: profile.avatarUrl }] }),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
