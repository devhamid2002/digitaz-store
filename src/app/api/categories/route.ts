import { readFile } from "fs/promises";
import { join } from "path";
import { jsonData, jsonError } from "@/lib/apiResponse";

// GET /api/categories: mock source is data/data.json until the real backend exists
export async function GET() {
  try {
    const filePath = join(process.cwd(), "data", "data.json");
    const raw = await readFile(filePath, "utf-8");
    const data = JSON.parse(raw);

    return jsonData({ categories: data.categories });
  } catch (error) {
    console.error("GET /api/categories failed:", error);
    return jsonError(
      "CATEGORIES_FETCH_FAILED",
      "Failed to fetch categories.",
      500
    );
  }
}
