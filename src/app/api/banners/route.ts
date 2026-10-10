import { readFile } from "fs/promises";
import { join } from "path";
import { jsonData, jsonError } from "@/lib/apiResponse";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "data", "data.json");
    const raw = await readFile(filePath, "utf-8");
    const data = JSON.parse(raw);

    return jsonData({ banners: data.banners });
  } catch (error) {
    console.error("GET /api/banners failed:", error);
    return jsonError("BANNERS_FETCH_FAILED", "Failed to fetch banners.", 500);
  }
}
