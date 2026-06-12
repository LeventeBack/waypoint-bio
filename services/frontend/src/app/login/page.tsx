import type { Metadata } from "next";
import { AuthScreen } from "@/features/auth/components/auth-screen";
import { LoginForm } from "@/features/auth/components/login-form";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Log in to manage your page."
      footerPrompt="New to Waypoint?"
      footerLinkLabel="Create your page"
      footerHref={ROUTES.register}
    >
      <LoginForm />
    </AuthScreen>
  );
}
