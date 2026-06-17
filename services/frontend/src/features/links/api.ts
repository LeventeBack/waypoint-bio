import { profileClient } from "@/lib/api/profile-client";
import { bearerAuth } from "@/lib/api/utils";
import type { CreateLinkInput, Link, UpdateLinkInput } from "./types";

export async function createLink(token: string, input: CreateLinkInput): Promise<Link> {
  const { data } = await profileClient.post<Link>("/profiles/me/links", input, {
    headers: bearerAuth(token),
  });
  return data;
}

export async function updateLink(token: string, id: string, input: UpdateLinkInput): Promise<Link> {
  const { data } = await profileClient.patch<Link>(`/profiles/me/links/${id}`, input, {
    headers: bearerAuth(token),
  });
  return data;
}

export async function deleteLink(token: string, id: string): Promise<void> {
  await profileClient.delete(`/profiles/me/links/${id}`, { headers: bearerAuth(token) });
}

export async function uploadLinkIcon(token: string, id: string, file: File): Promise<Link> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await profileClient.post<Link>(`/profiles/me/links/${id}/icon`, form, {
    headers: bearerAuth(token),
  });
  return data;
}
