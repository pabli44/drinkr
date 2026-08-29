import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyRefreshToken, signAccessToken } from "@/lib/auth/tokens";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "No hay refresh token" },
      { status: 401 }
    );
  }

  const payload = await verifyRefreshToken(refreshToken);

  if (!payload) {
    return NextResponse.json(
      { error: "Token invlido o expirado" },
      { status: 401 }
    );
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Token revocado o expirado" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const newAccessToken = await signAccessToken(user.id, user.role);

  const response = NextResponse.json({ ok: true });

  response.cookies.set("access_token", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15,
    path: "/",
  });

  return response;
}
