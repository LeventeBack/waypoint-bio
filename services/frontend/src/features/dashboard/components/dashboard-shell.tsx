import type { PropsWithChildren } from "react";
import { PreviewPane } from "./preview-pane";
import { Sidebar } from "./sidebar";

export function DashboardShell({ children }: PropsWithChildren) {
  return (
    <div className="h-screen flex bg-base">
      <Sidebar />
      <div className="flex-1 flex min-h-0">
        <section className="flex-1 overflow-y-auto min-w-0">{children}</section>
        <PreviewPane />
      </div>
    </div>
  );
}
