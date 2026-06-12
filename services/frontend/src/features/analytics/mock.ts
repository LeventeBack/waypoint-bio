import { GEO_SHARES, RANGE_DAYS } from "./constants";
import type { AnalyticsApi, LinkRef, ProfileStats } from "./types";

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createRng(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class MockAnalyticsApi implements AnalyticsApi {
  async getProfileStats(profileId: string, links: LinkRef[]): Promise<ProfileStats> {
    const rng = createRng(hashString(profileId));

    const base = 50 + Math.floor(rng() * 60);
    const trend = 0.5 + rng() * 1.5;
    const timeseries: ProfileStats["timeseries"] = [];
    for (let i = 0; i < RANGE_DAYS; i++) {
      const day = new Date();
      day.setDate(day.getDate() - (RANGE_DAYS - 1 - i));
      const noise = (rng() - 0.35) * base * 0.45;
      const clicks = Math.max(5, Math.round(base + i * trend + noise));
      timeseries.push({ date: day.toISOString().slice(0, 10), clicks });
    }

    const totalClicks = timeseries.reduce((sum, d) => sum + d.clicks, 0);
    const views = Math.round(totalClicks * (2.8 + rng() * 1.2));

    // Weights seeded by link id so the split survives reordering.
    const weights = links.map((link) => ({ link, weight: 0.3 + createRng(hashString(link.id))() }));
    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0) || 1;
    const perLink = weights
      .map(({ link, weight }) => ({
        linkId: link.id,
        title: link.title,
        clicks: Math.round((totalClicks * weight) / totalWeight),
      }))
      .sort((a, b) => b.clicks - a.clicks);

    return {
      rangeDays: RANGE_DAYS,
      views,
      totalClicks,
      viewsDelta: `+${(2 + rng() * 9).toFixed(1)}%`,
      clicksDelta: `+${(2 + rng() * 14).toFixed(1)}%`,
      perLink,
      timeseries,
      geo: GEO_SHARES.map(({ country, share }) => ({
        country,
        clicks: Math.round(totalClicks * share),
      })),
    };
  }
}
