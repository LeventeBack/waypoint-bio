"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import {
  createLinkAction,
  deleteLinkAction,
  reorderLinksAction,
  updateLinkAction,
} from "@/features/links/actions";
import type { LinkFormValues } from "@/features/links/schemas";
import type { Link } from "@/features/links/types";
import { updateProfileAction } from "@/features/profile/actions";
import type { Profile, ProfileWithLinks, UpdateProfileInput } from "@/features/profile/types";
import type { ActionResult } from "@/lib/action-result";
import type { PageTheme } from "@/lib/theme/types";
import { decodeTheme, encodeTheme } from "@/lib/theme/utils";

interface DashboardContextValue {
  profile: Profile;
  links: Link[];
  theme: PageTheme;
  /** Local-only update for live preview while typing; pair with saveProfile on blur. */
  setProfileLocal: (patch: Partial<Pick<Profile, "bio" | "avatarUrl">>) => void;
  /** Persists bio / avatarUrl / theme. Optimistic; re-syncs from the server on failure. */
  saveProfile: (input: UpdateProfileInput) => Promise<ActionResult<ProfileWithLinks>>;
  saveTheme: (theme: PageTheme) => Promise<ActionResult<ProfileWithLinks>>;
  createLink: (input: LinkFormValues) => Promise<ActionResult<Link>>;
  updateLink: (id: string, input: LinkFormValues) => Promise<ActionResult<Link>>;
  deleteLink: (id: string) => Promise<ActionResult<void>>;
  /** Applies a drag-reorder locally, then persists the changed positions. */
  reorderLinks: (reordered: Link[]) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}

interface DashboardProviderProps {
  initialProfile: ProfileWithLinks;
}

export function DashboardProvider({
  initialProfile,
  children,
}: PropsWithChildren<DashboardProviderProps>) {
  const router = useRouter();
  const { links: initialLinks, ...rest } = initialProfile;
  const [profile, setProfile] = useState<Profile>(rest);
  const [links, setLinks] = useState<Link[]>(initialLinks);

  const resync = useCallback(() => router.refresh(), [router]);

  const setProfileLocal = useCallback((patch: Partial<Pick<Profile, "bio" | "avatarUrl">>) => {
    setProfile((p) => ({ ...p, ...patch }));
  }, []);

  const saveProfile = useCallback(
    async (input: UpdateProfileInput) => {
      const previous = profile;
      setProfile((p) => ({ ...p, ...input }) as Profile);
      const result = await updateProfileAction(input);
      if (result.error === null) {
        const { links: _, ...updated } = result.data;
        setProfile(updated);
      } else {
        setProfile(previous);
        resync();
      }
      return result;
    },
    [profile, resync],
  );

  const saveTheme = useCallback(
    (theme: PageTheme) => saveProfile({ theme: encodeTheme(theme) }),
    [saveProfile],
  );

  const createLink = useCallback(
    async (input: LinkFormValues) => {
      const result = await createLinkAction({ ...input, order: links.length });
      if (result.error === null) setLinks((ls) => [...ls, result.data]);
      return result;
    },
    [links.length],
  );

  const updateLink = useCallback(async (id: string, input: LinkFormValues) => {
    const result = await updateLinkAction(id, input);
    if (result.error === null) setLinks((ls) => ls.map((l) => (l.id === id ? result.data : l)));
    return result;
  }, []);

  const deleteLink = useCallback(
    async (id: string) => {
      const previous = links;
      setLinks((ls) => ls.filter((l) => l.id !== id));
      const result = await deleteLinkAction(id);
      if (result.error !== null) {
        setLinks(previous);
        resync();
      }
      return result;
    },
    [links, resync],
  );

  const reorderLinks = useCallback(
    (reordered: Link[]) => {
      const withOrder = reordered.map((link, index) => ({ ...link, order: index }));
      const changed = withOrder.filter((link, index) => links[index]?.id !== link.id);
      setLinks(withOrder);
      if (changed.length === 0) return;
      reorderLinksAction(changed.map(({ id, order }) => ({ id, order }))).then((result) => {
        if (result.error !== null) resync();
      });
    },
    [links, resync],
  );

  const value = useMemo<DashboardContextValue>(
    () => ({
      profile,
      links,
      theme: decodeTheme(profile.theme),
      setProfileLocal,
      saveProfile,
      saveTheme,
      createLink,
      updateLink,
      deleteLink,
      reorderLinks,
    }),
    [
      profile,
      links,
      setProfileLocal,
      saveProfile,
      saveTheme,
      createLink,
      updateLink,
      deleteLink,
      reorderLinks,
    ],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}
