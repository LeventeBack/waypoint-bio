"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import type { ChartPointUI, ClicksChartUI } from "../types";

interface ChartTooltipProps {
  active?: boolean;
  payload?: { payload: ChartPointUI }[];
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="bg-raised border border-stroke rounded-lg px-2.5 py-1.5 shadow-pop whitespace-nowrap">
      <span className="text-[12px] font-semibold text-ink">{point.clicksLabel}</span>
      <span className="text-[12px] text-faint"> · {point.label}</span>
    </div>
  );
}

interface ClicksChartProps {
  chart: ClicksChartUI;
}

export function ClicksChart({ chart }: ClicksChartProps) {
  return (
    <div>
      <div className="h-50">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chart.points} margin={{ top: 16, right: 4, bottom: 4, left: 4 }}>
            <defs>
              <linearGradient id="wp-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--c-accent)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--c-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--c-stroke)" />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: "var(--c-stroke-strong)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="var(--c-accent)"
              strokeWidth={2}
              fill="url(#wp-area)"
              activeDot={{
                r: 4.5,
                fill: "var(--c-accent)",
                stroke: "var(--c-base)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between font-mono text-[11px] text-faint mt-2.5">
        {chart.axisLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
