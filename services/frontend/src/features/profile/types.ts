import type { Link } from "@/features/links/types";
import type { PageTheme } from "@/lib/theme/types";

export interface Profile {
  id: string;
  username: string;
  bio: string | null;
  theme: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileWithLinks extends Profile {
  links: Link[];
}

export interface UpdateProfileInput {
  bio?: string | null;
  theme?: string;
  avatarUrl?: string | null;
}

export interface PublicLinkUI {
  id: string;
  title: string;
  url: string;
}

export interface PublicProfileUI {
  username: string;
  handle: string;
  bio: string | null;
  avatarUrl: string | null;
  theme: PageTheme;
  links: PublicLinkUI[];
}
