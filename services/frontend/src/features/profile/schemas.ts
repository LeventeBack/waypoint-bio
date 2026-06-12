import { z } from "zod";
import { URL_PATTERN } from "@/lib/validation";
import { BIO_MAX_LENGTH, THEME_MAX_LENGTH } from "./constants";

export const imageUrlSchema = z
  .string()
  .regex(URL_PATTERN, "Enter a full image URL, including https://");

export const updateProfileSchema = z.object({
  bio: z
    .string()
    .max(BIO_MAX_LENGTH, `Keep your bio under ${BIO_MAX_LENGTH} characters.`)
    .nullable()
    .optional(),
  theme: z.string().max(THEME_MAX_LENGTH).optional(),
  avatarUrl: imageUrlSchema.nullable().optional(),
});
