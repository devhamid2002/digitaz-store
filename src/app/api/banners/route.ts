import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "data", "data.json");
    const raw = await readFile(filePath, "utf-8");
    const data = JSON.parse(raw);

    return NextResponse.json({ banners: data.banners });
  } catch (error) {
    console.error("GET /api/banners failed:", error);
    return NextResponse.json(
      { code: "BANNERS_FETCH_FAILED" },
      { status: 500 }
    );
  }
}
