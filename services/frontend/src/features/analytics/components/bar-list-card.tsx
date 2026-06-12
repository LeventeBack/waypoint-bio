import type { BarRowUI } from "../types";
import { BarRow } from "./bar-row";

interface BarListCardProps {
  title: string;
  rows: BarRowUI[];
  accent?: boolean;
  emptyMessage?: string;
}

export function BarListCard({ title, rows, accent = false, emptyMessage }: BarListCardProps) {
  return (
    <div className="bg-surface border border-stroke rounded-2xl p-5">
      <div className="text-[13.5px] font-bold text-ink mb-2">{title}</div>
      {rows.map((row) => (
        <BarRow key={row.id} row={row} accent={accent} />
      ))}
      {rows.length === 0 && emptyMessage && (
        <p className="text-[13px] text-muted py-2">{emptyMessage}</p>
      )}
    </div>
  );
}
