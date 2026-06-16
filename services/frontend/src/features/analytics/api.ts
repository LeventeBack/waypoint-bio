import { redirect } from "next/navigation";
import { getSessionToken } from "@/features/auth/session";
import { analyticsClient } from "@/lib/api/analytics-client";
import { bearerAuth } from "@/lib/api/utils";
import { ROUTES } from "@/lib/routes";
import { EVENT_INGEST_TIMEOUT_MS } from "./constants";
import type {
  ClickEventInput,
  IpStat,
  LinkRef,
  MeStats,
  ProfileStats,
  TimeseriesPoint,
} from "./types";
import { buildProfileStats } from "./utils";

export async function trackClick(event: ClickEventInput): Promise<void> {
  try {
    await analyticsClient.post("/events", event, { timeout: EVENT_INGEST_TIMEOUT_MS });
  } catch {
    console.warn("Failed to track click event", event);
  }
}

export async function getProfileStats(links: LinkRef[]): Promise<ProfileStats> {
  const token = await getSessionToken();
  if (!token) redirect(ROUTES.login);

  const headers = bearerAuth(token);

  try {
    const [me, timeseries, ips] = await Promise.all([
      analyticsClient.get<MeStats>("/stats/me", { headers }),
      analyticsClient.get<TimeseriesPoint[]>("/stats/me/timeseries", { headers }),
      analyticsClient.get<IpStat[]>("/stats/me/ips", { headers }),
    ]);

    return buildProfileStats(links, me.data, timeseries.data, ips.data);
  } catch {
    return buildProfileStats(links, { username: "", totalClicks: 0, perLink: [] }, [], []);
  }
}
