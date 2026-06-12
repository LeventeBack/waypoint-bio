import type { Metadata } from "next";
import { analyticsApi } from "@/features/analytics/api";
import { getClicksByLinkId } from "@/features/analytics/utils";
import { LinksEditor } from "@/features/links/components/links-editor";
import { getCurrentProfile } from "@/features/profile/api";

export const metadata: Metadata = {
  title: "Links",
};

export default async function LinksPage() {
  const profile = await getCurrentProfile();
  const stats = await analyticsApi.getProfileStats(profile.id, profile.links);

  return <LinksEditor clicksByLinkId={getClicksByLinkId(stats)} />;
}
