import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

/**
 * GET /api/categories
 * Mock API route that reads categories from data/data.json.
 * In production, this will be replaced by the real backend.
 */
export async function GET() {
  try {
    const filePath = join(process.cwd(), "data", "data.json");
    const raw = await readFile(filePath, "utf-8");
    const data = JSON.parse(raw);

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/categories failed:", error);
    return NextResponse.json(
      { code: "CATEGORIES_FETCH_FAILED" },
      { status: 500 }
    );
  }
}
