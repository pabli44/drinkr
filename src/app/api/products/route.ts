import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { expirePendingOrders } from "@/lib/order";
import type { Product as ProductType, Category as CategoryType } from "@/generated/client";

type ProductWithCategory = ProductType & { category?: CategoryType | null };

export async function GET(request: Request) {
  await expirePendingOrders();

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");

  const products = (await prisma.product.findMany({
    where: {
      isActive: true,
      ...(categoryId ? { categoryId } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  })) as ProductWithCategory[];

  return NextResponse.json({
    products: products.map((product) => ({
      ...product,
      regularPrice: Number(product.regularPrice),
      promoPrice: Number(product.promoPrice),
      category: product.category
        ? { ...(product.category as CategoryType) }
        : null,
    })),
  });
}
