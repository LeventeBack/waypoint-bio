import type { Profile } from "@/features/profile/types";

export interface AuthResponse {
  accessToken: string;
  profile: Profile;
}
