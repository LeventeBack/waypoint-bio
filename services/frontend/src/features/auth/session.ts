import { cookies } from "next/headers";
import { isProduction } from "@/lib/config";
import { SESSION_COOKIE, SESSION_FALLBACK_MAX_AGE_SECONDS } from "./constants";

function maxAgeFromToken(token: string): number {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    if (typeof payload.exp === "number") {
      const remaining = payload.exp - Math.floor(Date.now() / 1000);
      if (remaining > 0) return remaining;
    }
  } catch {
    // Not a parsable JWT — fall through to the default.
  }
  return SESSION_FALLBACK_MAX_AGE_SECONDS;
}

export async function createSession(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeFromToken(token),
  });
}

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
