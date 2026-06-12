import { formatDateLabel, formatNumber } from "@/lib/format";
import { MIN_BAR_PERCENT } from "./constants";
import type { ProfileStats, ProfileStatsUI } from "./types";

function toPercent(clicks: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(MIN_BAR_PERCENT, Math.round((clicks / max) * 100));
}

export function getClicksByLinkId(stats: ProfileStats): Record<string, number> {
  return Object.fromEntries(stats.perLink.map((p) => [p.linkId, p.clicks]));
}

export function formatProfileStatsUI(stats: ProfileStats): ProfileStatsUI {
  const maxLinkClicks = stats.perLink[0]?.clicks ?? 0;
  const maxGeoClicks = stats.geo[0]?.clicks ?? 0;
  const deltaSuffix = ` vs prev. ${stats.rangeDays} days`;

  const points = stats.timeseries.map((point) => ({
    date: point.date,
    label: formatDateLabel(point.date),
    clicks: point.clicks,
    clicksLabel: `${formatNumber(point.clicks)} clicks`,
  }));
  const mid = Math.floor(points.length / 2);

  return {
    rangeLabel: `Last ${stats.rangeDays} days`,
    views: formatNumber(stats.views),
    viewsDelta: `${stats.viewsDelta}${deltaSuffix}`,
    totalClicks: formatNumber(stats.totalClicks),
    clicksDelta: `${stats.clicksDelta}${deltaSuffix}`,
    clickRate: stats.views > 0 ? `${((stats.totalClicks / stats.views) * 100).toFixed(1)}%` : "—",
    topLinks: stats.perLink.map((link, index) => ({
      id: link.linkId,
      rank: index + 1,
      title: link.title,
      clicksLabel: formatNumber(link.clicks),
      percent: toPercent(link.clicks, maxLinkClicks),
    })),
    countries: stats.geo.map((geo) => ({
      id: geo.country,
      title: geo.country,
      clicksLabel: formatNumber(geo.clicks),
      percent: toPercent(geo.clicks, maxGeoClicks),
    })),
    chart: {
      points,
      axisLabels: points.length
        ? [points[0].label, points[mid].label, points[points.length - 1].label]
        : [],
    },
  };
}
