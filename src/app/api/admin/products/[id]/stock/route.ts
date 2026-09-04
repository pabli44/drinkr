import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = await getUserFromRequest(request);

  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const stock = typeof body.stock === "number" ? body.stock : Number(body.stock);

    if (Number.isNaN(stock) || stock < 0) {
      return NextResponse.json(
        { error: "El stock debe ser un número mayor o igual a 0" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: { stock },
      include: { category: true },
    });

    return NextResponse.json({
      product: {
        ...(product as unknown as Record<string, unknown>),
        regularPrice: Number(product.regularPrice),
        promoPrice: Number(product.promoPrice),
      },
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar el stock" },
      { status: 500 }
    );
  }
}
