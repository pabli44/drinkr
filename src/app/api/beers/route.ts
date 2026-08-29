import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createBeerSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const beers = await prisma.beer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(beers);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener cervezas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createBeerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const beer = await prisma.beer.create({
      data: parsed.data,
    });

    return NextResponse.json(beer, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear cerveza" },
      { status: 500 }
    );
  }
}
