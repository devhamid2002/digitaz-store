import { jsonData, jsonError } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const groups = await prisma.product.groupBy({
      by: ["category"],
      _count: { _all: true },
    });

    const categories = groups.map((group) => ({
      id: group.category,
      slug: group.category,
      name: group.category,
      icon: "",
      description: "",
      image: "",
      productCount: group._count._all,
    }));

    return jsonData({ categories });
  } catch (error) {
    console.error("GET /api/categories failed:", error);
    return jsonError(
      "CATEGORIES_FETCH_FAILED",
      "Failed to fetch categories.",
      500
    );
  }
}
