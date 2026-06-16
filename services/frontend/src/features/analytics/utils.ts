import { formatDateLabel, formatNumber } from "@/lib/format";
import { MIN_BAR_PERCENT, RANGE_DAYS } from "./constants";
import type {
  IpStat,
  LinkRef,
  MeStats,
  ProfileStats,
  ProfileStatsUI,
  TimeseriesPoint,
} from "./types";

function toPercent(clicks: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(MIN_BAR_PERCENT, Math.round((clicks / max) * 100));
}

export function buildProfileStats(
  links: LinkRef[],
  me: MeStats,
  timeseries: TimeseriesPoint[],
  ips: IpStat[],
): ProfileStats {
  const clicksByLinkId = new Map(me.perLink.map((stat) => [stat.linkId, stat.clicks]));
  const perLink = links
    .map((link) => ({
      linkId: link.id,
      title: link.title,
      clicks: clicksByLinkId.get(link.id) ?? 0,
    }))
    .sort((a, b) => b.clicks - a.clicks);

  const linkClicks = perLink.reduce((sum, link) => sum + link.clicks, 0);

  return {
    rangeDays: RANGE_DAYS,
    views: Math.max(0, me.totalClicks - linkClicks),
    totalClicks: linkClicks,
    perLink,
    timeseries,
    ips,
  };
}

export function getClicksByLinkId(stats: ProfileStats): Record<string, number> {
  return Object.fromEntries(stats.perLink.map((p) => [p.linkId, p.clicks]));
}

export function formatProfileStatsUI(stats: ProfileStats): ProfileStatsUI {
  const maxLinkClicks = stats.perLink[0]?.clicks ?? 0;
  const maxIpClicks = stats.ips[0]?.clicks ?? 0;

  const points = stats.timeseries.map((point) => ({
    date: point.date,
    label: formatDateLabel(point.date),
    clicks: point.clicks,
    clicksLabel: `${formatNumber(point.clicks)} clicks`,
  }));
  const mid = Math.floor(points.length / 2);
  const axisIndices = [...new Set([0, mid, points.length - 1])];

  return {
    rangeLabel: `Last ${stats.rangeDays} days`,
    views: formatNumber(stats.views),
    totalClicks: formatNumber(stats.totalClicks),
    clickRate: stats.views > 0 ? `${((stats.totalClicks / stats.views) * 100).toFixed(1)}%` : "—",
    topLinks: stats.perLink.map((link, index) => ({
      id: link.linkId,
      rank: index + 1,
      title: link.title,
      clicksLabel: formatNumber(link.clicks),
      percent: toPercent(link.clicks, maxLinkClicks),
    })),
    ips: stats.ips.map((ipStat) => ({
      id: ipStat.ip,
      title: ipStat.ip,
      clicksLabel: formatNumber(ipStat.clicks),
      percent: toPercent(ipStat.clicks, maxIpClicks),
    })),
    chart: {
      points,
      axisLabels: points.length ? axisIndices.map((i) => points[i].label) : [],
    },
  };
}
