"use server";

import { withToken } from "@/features/auth/utils";
import { fail, type ActionResult } from "@/lib/action-result";
import { firstIssueMessage } from "@/lib/validation";
import * as profileApi from "./api";
import { updateProfileSchema } from "./schemas";
import type { ProfileWithLinks, UpdateProfileInput } from "./types";

export async function updateProfileAction(
  input: UpdateProfileInput,
): Promise<ActionResult<ProfileWithLinks>> {
  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssueMessage(parsed.error));

  return withToken((token) => profileApi.updateProfile(token, parsed.data));
}
