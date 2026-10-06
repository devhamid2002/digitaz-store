import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ProductSpecifications } from "@/features/products/types/product";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;

    const p = await prisma.product.findUnique({ where: { slug } });

    if (!p) {
      return NextResponse.json(
        { code: "PRODUCT_NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("GET /api/products/[slug] failed:", error);
    return NextResponse.json(
      { code: "PRODUCT_FETCH_FAILED" },
      { status: 500 }
    );
  }
}
