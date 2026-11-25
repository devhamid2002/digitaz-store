import { jsonData, jsonError } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      select: { id: true, image: true, alt: true },
    });

    return jsonData({ banners });
  } catch (error) {
    console.error("GET /api/banners failed:", error);
    return jsonError("BANNERS_FETCH_FAILED", "Failed to fetch banners.", 500);
  }
}
