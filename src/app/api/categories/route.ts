import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ categories });
}
