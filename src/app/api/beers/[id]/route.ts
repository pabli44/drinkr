import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createBeerSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const beer = await prisma.beer.findUnique({
      where: { id },
    });

    if (!beer) {
      return NextResponse.json(
        { error: "Cerveza no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(beer);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener cerveza" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = createBeerSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const beer = await prisma.beer.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(beer);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar cerveza" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.beer.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar cerveza" },
      { status: 500 }
    );
  }
}
