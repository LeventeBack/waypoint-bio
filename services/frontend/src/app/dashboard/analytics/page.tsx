import type { Metadata } from "next";
import { analyticsApi } from "@/features/analytics/api";
import { AnalyticsView } from "@/features/analytics/components/analytics-view";
import { formatProfileStatsUI } from "@/features/analytics/utils";
import { getCurrentProfile } from "@/features/profile/api";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage() {
  const profile = await getCurrentProfile();
  const stats = await analyticsApi.getProfileStats(profile.id, profile.links);

  return <AnalyticsView stats={formatProfileStatsUI(stats)} />;
}
