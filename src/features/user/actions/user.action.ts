"use server";

import { prisma } from "@/lib/prisma";
import { toActionError } from "@/utils/actionError";

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        emailVerified: true,
        image: true,
        role: true,
        address: true,
        paymentMethod: true,
        createdAt: true,
        updateAt: true,
      },
    });

    if (!user) return toActionError(null, "USER_NOT_FOUND");

    return { data: user };
  } catch (error) {
    return toActionError(error, "USER_FETCH_FAILED");
  }
}
