import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { jsonData, jsonError } from "@/lib/apiResponse";
import { getAdminSession } from "@/lib/auth-gaurd";

// Keep uploads on the Node runtime: route handlers need filesystem access.
export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return jsonError("UNAUTHORIZED", "Admin access required.", 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return jsonError("INVALID_IMAGE", "Choose an image file.", 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return jsonError(
        "IMAGE_TOO_LARGE",
        "Image must be 5 MB or smaller.",
        413
      );
    }

    // Derive the extension from the MIME type, never from the client filename.
    const extension = IMAGE_EXTENSIONS[file.type];

    if (!extension) {
      return jsonError(
        "INVALID_IMAGE",
        "Unsupported image type. Use JPG, PNG, or WebP.",
        400
      );
    }

    const fileName = `${randomUUID()}.${extension}`;
    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products"
    );

    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(
      path.join(uploadDirectory, fileName),
      Buffer.from(await file.arrayBuffer())
    );

    return jsonData({ url: `/api/uploads/products/${fileName}` }, 201);
  } catch (error) {
    console.error("POST /api/products/upload failed:", error);
    return jsonError("IMAGE_UPLOAD_FAILED", "Failed to upload the image.", 500);
  }
}
