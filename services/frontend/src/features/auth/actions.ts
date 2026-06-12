"use server";

import { redirect } from "next/navigation";
import { fail, type ActionResult } from "@/lib/action-result";
import { getApiErrorMessage } from "@/lib/api/utils";
import { ROUTES } from "@/lib/routes";
import { firstIssueMessage } from "@/lib/validation";
import * as authApi from "./api";
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "./schemas";
import { createSession, destroySession } from "./session";
import type { AuthResponse } from "./types";

export async function loginAction(input: LoginFormValues): Promise<ActionResult<null>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssueMessage(parsed.error));

  const { username, password } = parsed.data;
  return authenticate(() => authApi.login(username, password));
}

export async function registerAction(input: RegisterFormValues): Promise<ActionResult<null>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssueMessage(parsed.error));

  const { username, password } = parsed.data;
  return authenticate(() => authApi.register(username, password));
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect(ROUTES.login);
}

async function authenticate(request: () => Promise<AuthResponse>): Promise<ActionResult<null>> {
  let auth: AuthResponse;
  try {
    auth = await request();
  } catch (err) {
    return fail(getApiErrorMessage(err, "Something went wrong. Please try again."));
  }

  await createSession(auth.accessToken);
  redirect(ROUTES.dashboardLinks);
}
