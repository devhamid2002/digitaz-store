import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
