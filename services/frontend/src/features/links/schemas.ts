import { z } from "zod";
import { URL_PATTERN } from "@/lib/validation";
import { LINK_TITLE_MAX_LENGTH } from "./constants";

export const linkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Add a title.")
    .max(LINK_TITLE_MAX_LENGTH, `Keep it under ${LINK_TITLE_MAX_LENGTH} characters.`),
  url: z.string().trim().regex(URL_PATTERN, "Enter a full URL, including https://"),
});

export type LinkFormValues = z.infer<typeof linkSchema>;

const linkOrderSchema = z.number().int().min(0);

export const createLinkSchema = linkSchema.extend({ order: linkOrderSchema.optional() });
export const updateLinkSchema = linkSchema.partial().extend({ order: linkOrderSchema.optional() });
export const reorderLinksSchema = z.array(
  z.object({ id: z.string().min(1), order: linkOrderSchema }),
);
