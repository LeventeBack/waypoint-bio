import { isAxiosError } from "axios";

interface ApiErrorBody {
  message?: string | string[];
}

export function bearerAuth(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err) && err.response) {
    const { message } = (err.response.data ?? {}) as ApiErrorBody;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
    return `Request failed with status ${err.response.status}`;
  }
  return fallback;
}

export function isNotFoundError(err: unknown): boolean {
  return isAxiosError(err) && err.response?.status === 404;
}
