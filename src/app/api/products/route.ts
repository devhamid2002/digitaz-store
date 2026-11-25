import { prisma } from "@/lib/prisma";
import { jsonData, jsonError } from "@/lib/apiResponse";
import type {
  Prisma,
  Product as ProductRecord,
} from "@/generated/prisma/client";
import type { ProductSpecifications } from "@/features/products/types/product";
import { parseProductFilters } from "@/features/products/utils/productFilters";

export async function GET(request: Request) {
  try {
    const filters = parseProductFilters(new URL(request.url).searchParams);
    const page = filters.page ?? 1;
    const limit = filters.limit;

    const where: Prisma.ProductWhereInput = {};

    if (filters.q) {
      // Search suggestions and results are scoped to product names; category
      // selection is handled by the separate category filter.
      where.name = { contains: filters.q };
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.inStock) {
      where.stock = { gt: 0 };
    }

    if (filters.onSale) {
      where.discount = { gt: 0 };
    }

    if (filters.featured) {
      where.isFeatured = true;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {
        ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
        ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
      };
    }

    const [total, priceBounds] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.aggregate({
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    const priceRange = {
      min: priceBounds._min.price ?? 0,
      max: priceBounds._max.price ?? 0,
    };
    const skip = limit ? (page - 1) * limit : 0;
    const totalPages = limit
      ? Math.ceil(total / limit)
      : total > 0
        ? 1
        : 0;

    let rows: ProductRecord[];

    if (filters.sort === "best-selling") {
      // SQLite cannot order by a related aggregate, so rank the filtered rows
      // by total sold quantity before applying pagination.
      const allRows = await prisma.product.findMany({ where });
      const sales =
        allRows.length > 0
          ? await prisma.orderItem.groupBy({
              by: ["productId"],
              where: { productId: { in: allRows.map((row) => row.id) } },
              _sum: { qty: true },
            })
          : [];

      const soldByProduct = new Map(
        sales.map((sale) => [sale.productId, sale._sum.qty ?? 0])
      );

      allRows.sort(
        (a, b) =>
          (soldByProduct.get(b.id) ?? 0) - (soldByProduct.get(a.id) ?? 0) ||
          b.createdAt.getTime() - a.createdAt.getTime()
      );

      rows = limit ? allRows.slice(skip, skip + limit) : allRows;
    } else {
      const orderBy: Prisma.ProductOrderByWithRelationInput =
        filters.sort === "price-asc"
          ? { price: "asc" }
          : filters.sort === "price-desc"
            ? { price: "desc" }
            : { createdAt: "desc" };

      rows = await prisma.product.findMany({
        where,
        orderBy,
        skip: limit ? skip : undefined,
        take: limit,
      });
    }

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

    return jsonData({ products, total, page, totalPages, priceRange });
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return jsonError("PRODUCTS_FETCH_FAILED", "Failed to fetch products.", 500);
  }
}
