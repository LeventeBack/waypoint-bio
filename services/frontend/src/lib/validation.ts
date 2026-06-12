import type { z } from "zod";

export const URL_PATTERN = /^https?:\/\/\S+\.\S+/;

export function firstIssueMessage(error: z.ZodError, fallback = "Invalid input."): string {
  return error.issues[0]?.message ?? fallback;
}
