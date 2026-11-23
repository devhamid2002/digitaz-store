"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toActionError } from "@/utils/actionError";
import {
  updateProfileSchema,
  type UpdateProfileValues,
} from "../types/user.validator";

const userProfileSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  emailVerified: true,
  image: true,
  role: true,
  paymentMethod: true,
  createdAt: true,
  updateAt: true,
} as const;

export async function getUserById(id: string) {
  const session = await auth();

  // A user may only read their own profile; admins keep access for support.
  if (!session?.user?.id) {
    return toActionError(null, "UNAUTHORIZED");
  }

  if (id !== session.user.id && session.user.role !== "admin") {
    return toActionError(null, "UNAUTHORIZED");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userProfileSelect,
    });

    if (!user) {
      return toActionError(null, "USER_NOT_FOUND");
    }

    return user;
  } catch (error) {
    return toActionError(error, "USER_FETCH_FAILED");
  }
}

export async function updateProfile(input: UpdateProfileValues) {
  const session = await auth();

  if (!session?.user?.id) {
    return toActionError(null, "UNAUTHORIZED");
  }

  const parsed = updateProfileSchema.safeParse(input);

  if (!parsed.success) {
    return toActionError(null, "PROFILE_INVALID");
  }

  const { name, email } = parsed.data;
  const data: { name: string; email?: string | null } = { name };

  if (email !== undefined) {
    data.email = email === "" ? null : email.toLowerCase();
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: userProfileSelect,
    });

    return { data: user };
  } catch (error) {
    return toActionError(error, "USER_UPDATE_FAILED");
  }
}
