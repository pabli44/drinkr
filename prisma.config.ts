import "dotenv/config";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env.local after .env so local overrides production
config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env["DIRECT_DATABASE_URL"],
  },
});
