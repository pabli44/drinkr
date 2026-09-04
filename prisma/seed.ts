import "dotenv/config";
import { config } from "dotenv";
import { hash } from "bcryptjs";
import { PrismaClient } from "../src/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Load .env.local after .env for local development
config({ path: ".env.local", override: true });
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "../src/lib/mock-data";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  }

  const passwordHash = await hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      name: "Administrador",
      role: "ADMIN",
    },
  });

  console.log(`Admin user created/updated: ${user.email}`);

  // Seed categories
  for (const category of MOCK_CATEGORIES) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        icon: category.icon,
        order: category.order,
        isActive: category.isActive,
      },
      create: {
        id: category.id,
        name: category.name,
        icon: category.icon,
        order: category.order,
        isActive: category.isActive,
      },
    });
  }
  console.log(`Categories seeded: ${MOCK_CATEGORIES.length}`);

  // Seed products
  for (const product of MOCK_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        presentation: product.presentation,
        regularPrice: product.regularPrice,
        promoPrice: product.promoPrice,
        stock: product.stock,
        imageUrl: product.imageUrl,
        isActive: product.isActive,
      },
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        presentation: product.presentation,
        regularPrice: product.regularPrice,
        promoPrice: product.promoPrice,
        stock: product.stock,
        imageUrl: product.imageUrl,
        isActive: product.isActive,
      },
    });
  }
  console.log(`Products seeded: ${MOCK_PRODUCTS.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

