import Link from "next/link";
import { CenteredScreen } from "@/components/ui/centered-screen";
import { ROUTES } from "@/lib/routes";

export default function NotFound() {
  return (
    <CenteredScreen>
      <div className="text-center">
        <h1 className="text-[22px] font-extrabold tracking-tight">
          This Waypoint doesn&apos;t exist
        </h1>
        <p className="text-[14px] text-muted mt-2">
          The page you&apos;re looking for was moved, deleted — or never set.
        </p>
      </div>
      <Link
        href={ROUTES.register}
        className="inline-flex items-center justify-center h-10 px-4 rounded-[10px] text-[14px] font-semibold bg-accent hover:bg-accent-hover text-accent-on transition-colors"
      >
        Claim this username
      </Link>
    </CenteredScreen>
  );
}
