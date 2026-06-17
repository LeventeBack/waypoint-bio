const MAX_FILE_SIZE_MB = 1;
export const MAX_IMAGE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_IMAGE_LABEL = `${MAX_FILE_SIZE_MB} MB`;

export function imageFileError(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Choose an image file.";
  if (file.size > MAX_IMAGE_BYTES) return `Image must be under ${MAX_IMAGE_LABEL}.`;
  return null;
}
