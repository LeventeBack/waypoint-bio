import { notFound, redirect } from "next/navigation";
import { getSessionToken } from "@/features/auth/session";
import { profileClient } from "@/lib/api/profile-client";
import { bearerAuth, isNotFoundError } from "@/lib/api/utils";
import { ROUTES } from "@/lib/routes";
import type { ProfileWithLinks, UpdateProfileInput } from "./types";

export const getMe = async (token: string): Promise<ProfileWithLinks> => {
  const { data } = await profileClient.get<ProfileWithLinks>("/profiles/me", {
    headers: bearerAuth(token),
  });
  return data;
};

export const getPublicProfile = async (username: string): Promise<ProfileWithLinks> => {
  const { data } = await profileClient.get<ProfileWithLinks>(
    `/profiles/${encodeURIComponent(username)}`,
  );
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

export async function getCurrentProfile(): Promise<ProfileWithLinks> {
  const token = await getSessionToken();
  if (!token) redirect(ROUTES.login);

  try {
    return await getMe(token);
  } catch {
    redirect(ROUTES.login);
  }
}

export async function getPublicProfileOr404(username: string): Promise<ProfileWithLinks> {
  try {
    return await getPublicProfile(username);
  } catch (err) {
    if (isNotFoundError(err)) notFound();
    throw err;
  }
}
