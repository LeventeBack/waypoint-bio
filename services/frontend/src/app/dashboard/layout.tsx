import type { PropsWithChildren } from "react";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { DashboardProvider } from "@/features/dashboard/dashboard-provider";
import { getCurrentProfile } from "@/features/profile/api";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const profile = await getCurrentProfile();

  return (
    <DashboardProvider initialProfile={profile}>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}
