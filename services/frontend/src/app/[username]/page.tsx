import type { Metadata } from "next";
import { getPublicProfileOr404 } from "@/features/profile/api";
import { PublicProfile } from "@/features/profile/components/public-profile";
import { buildProfileMetadata, formatPublicProfileUI } from "@/features/profile/utils";

interface PublicProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfileOr404(username);

  return buildProfileMetadata(profile);
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;
  const profile = await getPublicProfileOr404(username);

  return (
    <main className="min-h-dvh w-full flex flex-col">
      <PublicProfile profile={formatPublicProfileUI(profile)} track />
    </main>
  );
}
