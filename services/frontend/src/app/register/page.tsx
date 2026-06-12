import type { Metadata } from "next";
import { AuthScreen } from "@/features/auth/components/auth-screen";
import { RegisterForm } from "@/features/auth/components/register-form";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Create your page",
};

export default function RegisterPage() {
  return (
    <AuthScreen
      title="Create your Waypoint"
      subtitle="One page for everything you make."
      footerPrompt="Already have a page?"
      footerLinkLabel="Log in"
      footerHref={ROUTES.login}
    >
      <RegisterForm />
    </AuthScreen>
  );
}
