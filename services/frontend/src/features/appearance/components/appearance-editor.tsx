import { PageHeader } from "@/components/ui/page-header";
import { BackgroundSection } from "./background-section";
import { ButtonStyleSection } from "./button-style-section";
import { PresetSection } from "./preset-section";
import { ProfileSection } from "./profile-section";
import { SaveThemeBar } from "./save-theme-bar";

export function AppearanceEditor() {
  return (
    <div className="max-w-160 mx-auto w-full px-6 lg:px-10 py-9">
      <PageHeader
        title="Appearance"
        description="Start from a preset, then fine-tune every part. Changes go live once you save."
      />
      <PresetSection />
      <BackgroundSection />
      <ButtonStyleSection />
      <ProfileSection />
      <SaveThemeBar />
    </div>
  );
}
