import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { getSessionToken } from "@/features/auth/session";
import { profileClient } from "@/lib/api/profile-client";
import { readerClient } from "@/lib/api/reader-client";
import { bearerAuth, isNotFoundError } from "@/lib/api/utils";
import { ROUTES } from "@/lib/routes";
import type { ProfileWithLinks, UpdateProfileInput } from "./types";

async function visitorForwardHeaders(): Promise<Record<string, string> | undefined> {
  const incoming = await headers();
  const ip =
    incoming.get("x-forwarded-for")?.split(",")[0]?.trim() ?? incoming.get("x-real-ip")?.trim();
  return ip ? { "X-Forwarded-For": ip } : undefined;
}

export const getMe = async (token: string): Promise<ProfileWithLinks> => {
  const { data } = await profileClient.get<ProfileWithLinks>("/profiles/me", {
    headers: bearerAuth(token),
  });
  return data;
};

export const getPublicProfile = async (username: string): Promise<ProfileWithLinks> => {
  const { data } = await readerClient.get<ProfileWithLinks>(`/${encodeURIComponent(username)}`, {
    headers: await visitorForwardHeaders(),
  });
  return data;
};

export async function updateProfile(
  token: string,
  input: UpdateProfileInput,
): Promise<ProfileWithLinks> {
  const { data } = await profileClient.put<ProfileWithLinks>("/profiles/me", input, {
    headers: bearerAuth(token),
  });
  return data;
}

export async function uploadAvatar(token: string, file: File): Promise<ProfileWithLinks> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await profileClient.post<ProfileWithLinks>("/profiles/me/avatar", form, {
    headers: bearerAuth(token),
  });
  return data;
}

export async function getCurrentProfile(): Promise<ProfileWithLinks> {
  const token = await getSessionToken();
  if (!token) redirect(ROUTES.login);

  try {
    return await getMe(token);
  } catch {
    redirect(ROUTES.login);
  }
}

export const getPublicProfileOr404 = cache(async (username: string): Promise<ProfileWithLinks> => {
  try {
    return await getPublicProfile(username);
  } catch (err) {
    if (isNotFoundError(err)) notFound();
    throw err;
  }
});
