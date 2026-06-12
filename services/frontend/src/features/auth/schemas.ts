import { z } from "zod";
import { PASSWORD_MIN_LENGTH, USERNAME_PATTERN } from "./constants";

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Enter your username."),
  password: passwordSchema,
});

export const registerSchema = z.object({
  username: z
    .string()
    .regex(
      USERNAME_PATTERN,
      "3-30 characters; lowercase letters, numbers, underscores and dashes only.",
    ),
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
