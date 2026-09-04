import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import type { Product as ProductType, Category as CategoryType } from "@/generated/client";

export async function GET(request: Request) {
  const payload = await getUserFromRequest(request);

  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "asc" },
    }) as Promise<ProductWithCategory[]>,
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return NextResponse.json({
    products: serializeProducts(products),
    categories: categories.map((category) => ({ ...category })),
  });
}

type ProductWithCategory = ProductType & { category?: CategoryType | null };

function serializeProducts(products: ProductWithCategory[]) {
  return products.map((product) => ({
    ...product,
    regularPrice: Number(product.regularPrice),
    promoPrice: Number(product.promoPrice),
    category: product.category
      ? { ...(product.category as unknown as CategoryType) }
      : null,
  }));
}
