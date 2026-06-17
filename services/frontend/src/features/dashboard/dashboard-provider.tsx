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
  uploadLinkIconAction,
} from "@/features/links/actions";
import type { LinkFormValues } from "@/features/links/schemas";
import type { Link } from "@/features/links/types";
import { updateProfileAction, uploadAvatarAction } from "@/features/profile/actions";
import type { Profile, ProfileWithLinks, UpdateProfileInput } from "@/features/profile/types";
import { ok, type ActionResult } from "@/lib/action-result";
import type { PageTheme } from "@/lib/theme/types";
import { decodeTheme, encodeTheme } from "@/lib/theme/utils";

interface DashboardContextValue {
  profile: Profile;
  links: Link[];
  theme: PageTheme;
  themeDirty: boolean;
  /** Local-only update for live preview while typing; pair with saveProfile on blur. */
  setProfileLocal: (patch: Partial<Pick<Profile, "bio" | "avatarUrl" | "displayName">>) => void;
  /** Local-only theme update for live preview; persist explicitly with saveTheme. */
  setThemeLocal: (theme: PageTheme) => void;
  /** Persists bio / avatarUrl / theme. Optimistic; re-syncs from the server on failure. */
  saveProfile: (input: UpdateProfileInput) => Promise<ActionResult<ProfileWithLinks>>;
  /** Uploads a new avatar image and applies the returned profile. */
  uploadAvatar: (file: File) => Promise<ActionResult<ProfileWithLinks>>;
  /** Uploads an icon image for a link and applies the returned link. */
  uploadLinkIcon: (id: string, file: File) => Promise<ActionResult<Link>>;
  /** Persists the locally staged theme. */
  saveTheme: () => Promise<ActionResult<ProfileWithLinks>>;
  /** Discards staged theme changes, reverting to the last saved theme. */
  resetTheme: () => void;
  createLink: (input: LinkFormValues) => Promise<ActionResult<Link>>;
  updateLink: (id: string, input: LinkFormValues) => Promise<ActionResult<Link>>;
  deleteLink: (id: string) => Promise<ActionResult<void>>;
  /** True when the local link order differs from the last persisted one. */
  orderDirty: boolean;
  /** Applies a drag-reorder locally; persist explicitly with saveOrder. */
  reorderLinks: (reordered: Link[]) => void;
  /** Persists the locally staged link order. */
  saveOrder: () => Promise<ActionResult<Link[]>>;
  /** Discards staged reordering, reverting to the last saved order. */
  resetOrder: () => void;
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
  const [savedTheme, setSavedTheme] = useState(() => encodeTheme(decodeTheme(rest.theme)));
  const [savedOrder, setSavedOrder] = useState<string[]>(() => initialLinks.map((l) => l.id));

  const resync = useCallback(() => router.refresh(), [router]);

  const setProfileLocal = useCallback(
    (patch: Partial<Pick<Profile, "bio" | "avatarUrl" | "displayName">>) => {
      setProfile((p) => ({ ...p, ...patch }));
    },
    [],
  );

  const setThemeLocal = useCallback((theme: PageTheme) => {
    setProfile((p) => ({ ...p, theme: encodeTheme(theme) }));
  }, []);

  const resetTheme = useCallback(() => {
    setProfile((p) => ({ ...p, theme: savedTheme }));
  }, [savedTheme]);

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

  const saveTheme = useCallback(async () => {
    const encoded = encodeTheme(decodeTheme(profile.theme));
    const result = await saveProfile({ theme: encoded });
    if (result.error === null) setSavedTheme(encoded);
    return result;
  }, [profile.theme, saveProfile]);

  const uploadAvatar = useCallback(async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const result = await uploadAvatarAction(form);
    if (result.error === null) {
      const { links: _, ...updated } = result.data;
      setProfile(updated);
    }
    return result;
  }, []);

  const createLink = useCallback(
    async (input: LinkFormValues) => {
      const result = await createLinkAction({ ...input, order: links.length });
      if (result.error === null) {
        setLinks((ls) => [...ls, result.data]);
        setSavedOrder((so) => [...so, result.data.id]);
      }
      return result;
    },
    [links.length],
  );

  const updateLink = useCallback(async (id: string, input: LinkFormValues) => {
    const result = await updateLinkAction(id, input);
    if (result.error === null) setLinks((ls) => ls.map((l) => (l.id === id ? result.data : l)));
    return result;
  }, []);

  const uploadLinkIcon = useCallback(async (id: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    const result = await uploadLinkIconAction(id, form);
    if (result.error === null) setLinks((ls) => ls.map((l) => (l.id === id ? result.data : l)));
    return result;
  }, []);

  const deleteLink = useCallback(
    async (id: string) => {
      const previous = links;
      const previousOrder = savedOrder;
      setLinks((ls) => ls.filter((l) => l.id !== id));
      setSavedOrder((so) => so.filter((sid) => sid !== id));
      const result = await deleteLinkAction(id);
      if (result.error !== null) {
        setLinks(previous);
        setSavedOrder(previousOrder);
        resync();
      }
      return result;
    },
    [links, savedOrder, resync],
  );

  const reorderLinks = useCallback((reordered: Link[]) => {
    setLinks(reordered.map((link, index) => ({ ...link, order: index })));
  }, []);

  const saveOrder = useCallback(async () => {
    const changed = links.filter((link, index) => savedOrder[index] !== link.id);
    if (changed.length === 0) return ok(links);
    const result = await reorderLinksAction(changed.map(({ id, order }) => ({ id, order })));
    if (result.error === null) setSavedOrder(links.map((l) => l.id));
    return result;
  }, [links, savedOrder]);

  const resetOrder = useCallback(() => {
    setLinks((ls) =>
      [...ls]
        .sort((a, b) => savedOrder.indexOf(a.id) - savedOrder.indexOf(b.id))
        .map((link, index) => ({ ...link, order: index })),
    );
  }, [savedOrder]);

  const value = useMemo<DashboardContextValue>(() => {
    const theme = decodeTheme(profile.theme);
    return {
      profile,
      links,
      theme,
      themeDirty: encodeTheme(theme) !== savedTheme,
      setProfileLocal,
      setThemeLocal,
      saveProfile,
      saveTheme,
      resetTheme,
      uploadAvatar,
      uploadLinkIcon,
      createLink,
      updateLink,
      deleteLink,
      orderDirty: links.some((link, index) => savedOrder[index] !== link.id),
      reorderLinks,
      saveOrder,
      resetOrder,
    };
  }, [
    profile,
    links,
    savedTheme,
    savedOrder,
    setProfileLocal,
    setThemeLocal,
    saveProfile,
    saveTheme,
    resetTheme,
    uploadAvatar,
    uploadLinkIcon,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
    saveOrder,
    resetOrder,
  ]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}
