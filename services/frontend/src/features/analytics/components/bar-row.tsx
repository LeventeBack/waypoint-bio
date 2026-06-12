import type { BarRowUI } from "../types";

interface BarRowProps {
  row: BarRowUI;
  accent?: boolean;
}

export function BarRow({ row, accent = false }: BarRowProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      {row.rank !== undefined && (
        <span className="font-mono text-[11px] text-faint w-4 text-right shrink-0">{row.rank}</span>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-3">
          <span className="text-[13px] font-semibold text-ink truncate">{row.title}</span>
          <span className="font-mono text-[12px] text-muted shrink-0">{row.clicksLabel}</span>
        </div>
        <div className="h-1.5 bg-raised rounded-full mt-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${accent ? "bg-accent" : "bg-stroke-strong"}`}
            style={{ width: `${row.percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
