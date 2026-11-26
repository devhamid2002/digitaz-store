import "dotenv/config";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../src/generated/prisma/client.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const connectionString =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

interface ProductColorSeed {
  name: string;
  hex: string;
}

interface ProductSpecificationsSeed {
  colors?: ProductColorSeed[];
  sizes?: string[];
}

interface BannerSeed {
  id: string;
  image: string;
  alt: string;
}

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
  specifications?: ProductSpecificationsSeed;
}

// Fallback variants keep reseeds consistent when data.json omits them
const DEFAULT_SPECIFICATIONS: Required<ProductSpecificationsSeed> = {
  colors: [
    { name: "خاکستری ذغالی", hex: "#3a3f44" },
    { name: "خاکستری روشن", hex: "#d1d5db" },
    { name: "بژ", hex: "#f3e8d3" },
    { name: "مشکی", hex: "#111111" },
  ],
  sizes: ["S", "M", "L", "XL", "XXL"],
};

function toSpecifications(
  specifications?: ProductSpecificationsSeed,
): Prisma.InputJsonValue {
  // Plain seed objects lack Prisma's Json index signatures, so assert the
  // runtime JSON shape instead of restructuring the seed types.
  return {
    colors: specifications?.colors ?? DEFAULT_SPECIFICATIONS.colors,
    sizes: specifications?.sizes ?? DEFAULT_SPECIFICATIONS.sizes,
  } as unknown as Prisma.InputJsonValue;
}

async function main() {
  // Upsert by slug keeps re-seeds idempotent
  const raw = await readFile(join(rootDir, "data", "data.json"), "utf-8");
  const data = JSON.parse(raw) as {
    products: ProductSeed[];
    banners?: BannerSeed[];
  };

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
        specifications: toSpecifications(p.specifications),
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
        specifications: toSpecifications(p.specifications),
      },
    });
  }

  console.log(`Seeded ${data.products.length} products.`);

  // Preserve JSON array order in the slider via sortOrder
  for (const [index, banner] of (data.banners ?? []).entries()) {
    await prisma.banner.upsert({
      where: { id: banner.id },
      update: {
        image: banner.image,
        alt: banner.alt,
        sortOrder: index,
      },
      create: {
        id: banner.id,
        image: banner.image,
        alt: banner.alt,
        sortOrder: index,
      },
    });
  }

  console.log(`Seeded ${data.banners?.length ?? 0} banners.`);
}

async function run() {
  try {
    await main();
  } finally {
    await prisma.$disconnect();
  }
}

void run();
