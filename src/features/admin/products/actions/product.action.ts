"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toActionError } from "@/utils/actionError";
import type { ActionResult } from "@/utils/actionResult";
import type { ProductFormValues } from "../types/productForm";
import { productFormSchema } from "../types/productForm.validator";
import type { AdminProductRow } from "../types/productRow";

// The catalog validator requires both arrays; an empty specification is valid.
const EMPTY_SPECIFICATIONS = { colors: [], sizes: [] };

// slugify strips non-Latin names (e.g. Persian), so fall back to a random
// token instead of creating an empty slug.
async function buildUniqueSlug(name: string): Promise<string> {
  const base =
    slugify(name, { lower: true, strict: true, trim: true }) ||
    `product-${randomUUID().slice(0, 8)}`;

  let slug = base;
  let suffix = 2;

  while (
    await prisma.product.findUnique({ where: { slug }, select: { id: true } })
  ) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

// Admin listing reads Prisma directly: server components cannot fetch the
// app's own relative API route, and this keeps the payload narrow.
export async function getAdminProducts(): Promise<
  ActionResult<AdminProductRow[]>
> {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return toActionError(null, "UNAUTHORIZED");
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        name: true,
        image: true,
        category: true,
        brand: true,
        price: true,
        stock: true,
      },
    });

    return { data: products };
  } catch (error) {
    console.error("Failed to fetch admin products:", error);
    return toActionError(error, "PRODUCTS_FETCH_FAILED");
  }
}

export async function createProduct(
  input: ProductFormValues
): Promise<ActionResult<{ id: string; slug: string }>> {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return toActionError(null, "UNAUTHORIZED");
  }

  const parsed = productFormSchema.safeParse(input);

  if (!parsed.success) {
    return toActionError(null, "PRODUCT_SAVE_FAILED");
  }

  const { originalPrice, discount, ...values } = parsed.data;

  try {
    const product = await prisma.product.create({
      data: {
        ...values,
        slug: await buildUniqueSlug(values.name),
        originalPrice: originalPrice ?? null,
        discount: discount ?? null,
        rating: 0,
        ratingCount: 0,
        specifications: EMPTY_SPECIFICATIONS,
      },
      select: { id: true, slug: true },
    });

    revalidatePath("/admin/products");

    return { data: product };
  } catch (error) {
    console.error("Failed to create product:", error);
    return toActionError(error, "PRODUCT_SAVE_FAILED");
  }
}

export async function deleteProduct(
  slug: string
): Promise<ActionResult<{ slug: string }>> {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return toActionError(null, "UNAUTHORIZED");
  }

  try {
    await prisma.product.delete({ where: { slug } });

    revalidatePath("/admin/products");

    return { data: { slug } };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return toActionError(error, "PRODUCT_DELETE_FAILED");
  }
}
