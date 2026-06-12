import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/features/auth/constants";
import { ROUTES } from "@/lib/routes";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (pathname.startsWith("/dashboard") && !hasSession) {
    return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }

  if ((pathname === ROUTES.login || pathname === ROUTES.register) && hasSession) {
    return NextResponse.redirect(new URL(ROUTES.dashboardLinks, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
