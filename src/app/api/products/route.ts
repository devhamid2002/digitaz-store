import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  const filePath = join(process.cwd(), "data", "data.json");
  const raw = await readFile(filePath, "utf-8");
  const data = JSON.parse(raw);

  return NextResponse.json({ products: data.products });
}
