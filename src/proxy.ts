import { NextRequest, NextResponse } from "next/server";

const ADMIN_ROUTES = ["/admin"];

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isAdmin = ADMIN_ROUTES.some((route) => path.startsWith(route));

  if (isAdmin) {
    const token = request.cookies.get("admin_token");
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
