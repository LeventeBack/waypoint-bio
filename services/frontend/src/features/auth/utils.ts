import { fail, ok, type ActionResult } from "@/lib/action-result";
import { getApiErrorMessage } from "@/lib/api/utils";
import { getSessionToken } from "./session";

export async function withToken<T>(fn: (token: string) => Promise<T>): Promise<ActionResult<T>> {
  const token = await getSessionToken();
  if (!token) return fail("Not authenticated");

  try {
    return ok(await fn(token));
  } catch (err) {
    return fail(getApiErrorMessage(err, "Failed to save changes"));
  }
}
