export type ActionResult<T> = { error: null; data: T } | { error: string; data: null };

export function ok<T>(data: T): ActionResult<T> {
  return { error: null, data };
}

export function fail(error: string): ActionResult<never> {
  return { error, data: null };
}
