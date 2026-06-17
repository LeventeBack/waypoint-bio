"use server";

import { withToken } from "@/features/auth/utils";
import { fail, type ActionResult } from "@/lib/action-result";
import { firstIssueMessage } from "@/lib/validation";
import * as linksApi from "./api";
import { createLinkSchema, reorderLinksSchema, updateLinkSchema } from "./schemas";
import type { CreateLinkInput, Link, LinkOrderUpdate, UpdateLinkInput } from "./types";

export async function createLinkAction(input: CreateLinkInput): Promise<ActionResult<Link>> {
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssueMessage(parsed.error));

  return withToken((token) => linksApi.createLink(token, parsed.data));
}

export async function updateLinkAction(
  id: string,
  input: UpdateLinkInput,
): Promise<ActionResult<Link>> {
  const parsed = updateLinkSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssueMessage(parsed.error));

  return withToken((token) => linksApi.updateLink(token, id, parsed.data));
}

export async function deleteLinkAction(id: string): Promise<ActionResult<void>> {
  return withToken((token) => linksApi.deleteLink(token, id));
}

export async function uploadLinkIconAction(
  id: string,
  formData: FormData,
): Promise<ActionResult<Link>> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return fail("Choose an image to upload.");

  return withToken((token) => linksApi.uploadLinkIcon(token, id, file));
}

export async function reorderLinksAction(
  updates: LinkOrderUpdate[],
): Promise<ActionResult<Link[]>> {
  const parsed = reorderLinksSchema.safeParse(updates);
  if (!parsed.success) return fail(firstIssueMessage(parsed.error));

  return withToken((token) =>
    Promise.all(parsed.data.map(({ id, order }) => linksApi.updateLink(token, id, { order }))),
  );
}
