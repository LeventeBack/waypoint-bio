import { PageHeader } from "@/components/ui/page-header";
import type { ProfileStatsUI } from "../types";
import { BarListCard } from "./bar-list-card";
import { ClicksChart } from "./clicks-chart";
import { StatCard } from "./stat-card";

interface AnalyticsViewProps {
  stats: ProfileStatsUI;
}

export function AnalyticsView({ stats }: AnalyticsViewProps) {
  return (
    <div className="max-w-200 mx-auto w-full px-6 lg:px-10 py-9">
      <PageHeader title="Analytics" description="How your page performed.">
        <span className="font-mono text-[12px] text-muted bg-surface border border-stroke rounded-full h-8 px-3.5 inline-flex items-center">
          {stats.rangeLabel}
        </span>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-7">
        <StatCard label="Profile views" value={stats.views} delta={stats.viewsDelta} />
        <StatCard label="Total clicks" value={stats.totalClicks} delta={stats.clicksDelta} />
        <StatCard label="Click rate" value={stats.clickRate} />
      </div>

      <div className="bg-surface border border-stroke rounded-2xl p-5 mt-2.5">
        <div className="text-[13.5px] font-bold text-ink mb-4">Clicks per day</div>
        <ClicksChart chart={stats.chart} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 mt-2.5">
        <BarListCard
          title="Top links"
          rows={stats.topLinks}
          accent
          emptyMessage="Add links to see their performance here."
        />
        <BarListCard title="Clicks by country" rows={stats.countries} />
      </div>
    </div>
  );
}
