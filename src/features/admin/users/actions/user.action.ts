"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toActionError } from "@/utils/actionError";
import type { ActionResult } from "@/utils/actionResult";
import {
  adminUserUpdateSchema,
  type AdminUserUpdateValues,
} from "../types/userForm.validator";
import { userType } from "../types/userRow";

const adminUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
} as const;

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

// Admin listing reads Prisma directly: server components cannot fetch the
// app's own relative API route, and this keeps the payload narrow.
export async function getAllUsers(): Promise<
  ActionResult<userType[]>
> {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return toActionError(null, "UNAUTHORIZED");
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: adminUserSelect,
    });

    return { data: users };
  } catch (error) {
    console.error("Failed to fetch admin users:", error);
    return toActionError(error, "USERS_FETCH_FAILED");
  }
}

export async function updateUser(
  input: AdminUserUpdateValues
): Promise<ActionResult<userType>> {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return toActionError(null, "UNAUTHORIZED");
  }

  const parsed = adminUserUpdateSchema.safeParse(input);

  if (!parsed.success) {
    return toActionError(null, "USER_SAVE_FAILED");
  }

  const { id, name, email, phone, role } = parsed.data;

  // Demoting the signed-in admin would lock this account out of the panel.
  if (id === session.user.id && role !== "admin") {
    return toActionError(null, "USER_SELF_ACTION");
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email: email === "" ? null : email.toLowerCase(),
        phone,
        role,
      },
      select: adminUserSelect,
    });

    revalidatePath("/admin/users");

    return { data: user };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return toActionError(null, "USER_CONFLICT");
    }

    console.error("Failed to update user:", error);
    return toActionError(error, "USER_SAVE_FAILED");
  }
}

export async function deleteUser(
  id: string
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return toActionError(null, "UNAUTHORIZED");
  }

  // Deleting the signed-in admin would remove its own session mid-request.
  if (id === session.user.id) {
    return toActionError(null, "USER_SELF_ACTION");
  }

  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/users");

    return { data: { id } };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return toActionError(error, "USER_DELETE_FAILED");
  }
}
