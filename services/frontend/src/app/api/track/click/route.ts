import { NextResponse } from "next/server";
import { trackClick } from "@/features/analytics/api";

// Strip the IPv4-mapped IPv6 prefix ("::ffff:1.2.3.4" -> "1.2.3.4")
function normalizeIp(ip: string): string {
  return ip.replace(/^::ffff:/i, "");
}

// Resolve the client IP for a click. Order of preference:
//   1. X-Real-IP        - set by a reverse proxy / k8s ingress (or a GCP LB custom header)
//   2. X-Forwarded-For  - first entry; set by load balancers / Cloud Run
function clientIp(request: Request): string | undefined {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return normalizeIp(realIp);

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded ? normalizeIp(forwarded) : undefined;
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: { username?: unknown; linkId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { username, linkId } = body;
  if (typeof username !== "string" || typeof linkId !== "string") {
    return NextResponse.json({ error: "username and linkId are required" }, { status: 400 });
  }

  await trackClick({ username, linkId, ip: clientIp(request) });
  return new NextResponse(null, { status: 202 });
}
