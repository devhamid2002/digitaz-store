import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const adapter = new PrismaBetterSqlite3({ url: join(rootDir, "dev.db") });
const prisma = new PrismaClient({ adapter });

interface ProductSeed {
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  brand: string;
  stock: number;
  rating: number;
  ratingCount: number;
  viewCount?: number;
  isFeatured?: boolean;
}

async function main() {
  const raw = await readFile(join(rootDir, "data", "data.json"), "utf-8");
  const data = JSON.parse(raw) as { products: ProductSeed[] };

  for (const p of data.products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        category: p.category,
        description: p.description,
        image: p.image,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        discount: p.discount ?? null,
        brand: p.brand,
        stock: p.stock,
        rating: p.rating,
        ratingCount: p.ratingCount,
        viewCount: p.viewCount ?? 0,
        isFeatured: p.isFeatured ?? false,
      },
      create: {
        slug: p.slug,
        name: p.name,
        category: p.category,
        description: p.description,
        image: p.image,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        discount: p.discount ?? null,
        brand: p.brand,
        stock: p.stock,
        rating: p.rating,
        ratingCount: p.ratingCount,
        viewCount: p.viewCount ?? 0,
        isFeatured: p.isFeatured ?? false,
      },
    });
  }

  console.log(`Seeded ${data.products.length} products.`);
}

async function run() {
  try {
    await main();
  } finally {
    await prisma.$disconnect();
  }
}

void run();
