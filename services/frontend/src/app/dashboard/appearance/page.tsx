import type { Metadata } from "next";
import { AppearanceEditor } from "@/features/appearance/components/appearance-editor";

export const metadata: Metadata = {
  title: "Appearance",
};

export default function AppearancePage() {
  return <AppearanceEditor />;
}
