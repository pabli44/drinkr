import { cookies } from "next/headers";
import { verifyAccessToken } from "./tokens";
import { prisma } from "@/lib/db";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true, phone: true, address: true },
  });

  return user;
});
