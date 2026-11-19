import { readFile } from "node:fs/promises";
import path from "node:path";

// Runtime uploads live outside the build output, so `next start` cannot serve
// them as public files; this route streams them from the uploads directory.
export const runtime = "nodejs";

const IMAGE_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

// Only names written by the upload route (UUID + known extension) are served.
const FILE_NAME_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/i;

interface Params {
  params: Promise<{ file: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { file } = await params;
  const match = FILE_NAME_PATTERN.exec(file);

  if (!match) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const image = await readFile(
      path.join(process.cwd(), "public", "uploads", "products", file)
    );

    return new Response(image, {
      headers: {
        "Content-Type": IMAGE_TYPES[match[1].toLowerCase()],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
