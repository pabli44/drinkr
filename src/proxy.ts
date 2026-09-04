import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_ROUTES = ["/admin", "/api/admin"];
const PUBLIC_ADMIN_ROUTES = ["/admin/login"];

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return new TextEncoder().encode(secret);
}

async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "ADMIN";
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    path.startsWith(route)
  );

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const isPublicAdminRoute = PUBLIC_ADMIN_ROUTES.some((route) =>
    path.startsWith(route)
  );

  if (isPublicAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;

  if (!token || !(await verifyAdminToken(token))) {
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
