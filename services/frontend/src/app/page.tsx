import { redirect } from "next/navigation";
import { getSessionToken } from "@/features/auth/session";
import { ROUTES } from "@/lib/routes";

export default async function HomePage() {
  const token = await getSessionToken();

  redirect(token ? ROUTES.dashboardLinks : ROUTES.login);
}
