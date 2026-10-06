import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ProductSpecifications } from "@/features/products/types/product";

export async function GET() {
  try {
    const rows = await prisma.product.findMany({
      orderBy: { createdAt: "asc" },
    });

    const products = rows.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      description: p.description,
      image: p.image,
      price: p.price,
      originalPrice: p.originalPrice,
      discount: p.discount,
      brand: p.brand,
      stock: p.stock,
      rating: p.rating,
      ratingCount: p.ratingCount,
      viewCount: p.viewCount,
      isFeatured: p.isFeatured,
      // JSON column; shape is validated by the catalog actions before render
      specifications: p.specifications as unknown as ProductSpecifications,
    }));

    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json(
      { code: "PRODUCTS_FETCH_FAILED" },
      { status: 500 }
    );
  }
}
