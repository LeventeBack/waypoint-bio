export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
