import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import type { Product as ProductType, Category as CategoryType } from "@/generated/client";

export async function GET(request: Request) {
  const payload = await getUserFromRequest(request);

  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [products, categories, reservedAgg] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "asc" },
    }) as Promise<ProductWithCategory[]>,
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        order: {
          status: "PENDING_WHATSAPP",
        },
      },
      _sum: {
        quantity: true,
      },
    }),
  ]);

  const reservedByProduct = new Map(
    reservedAgg.map((row) => [row.productId, row._sum.quantity ?? 0])
  );

  return NextResponse.json({
    products: serializeProducts(products, reservedByProduct),
    categories: categories.map((category) => ({ ...category })),
  });
}

type ProductWithCategory = ProductType & { category?: CategoryType | null };

function serializeProducts(
  products: ProductWithCategory[],
  reservedByProduct: Map<string, number>
) {
  return products.map((product) => ({
    ...product,
    regularPrice: Number(product.regularPrice),
    promoPrice: Number(product.promoPrice),
    reserved: reservedByProduct.get(product.id) ?? 0,
    category: product.category
      ? { ...(product.category as unknown as CategoryType) }
      : null,
  }));
}
