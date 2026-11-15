import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PAGE_SIZE } from "@/lib/utils";
import { toActionError } from "@/utils/actionError";

export async function getMyOrders({limit = PAGE_SIZE, page} : {
    limit?: number,
    page: number
}) {
    const session = await auth();

    if (!session?.user?.id) {
      return toActionError(null, "UNAUTHORIZED");
    }

    const data = await prisma.order.findMany({
        where: {userId: session.user.id,},
        orderBy: {createdAt: "desc"},
        take: limit,
        skip: (page - 1) * limit
      });

      const dataCount = await prisma.order.count({
        where: {userId: session.user.id,},
      });

      return {
        data: data,
        totalPages: Math.ceil(dataCount / limit)
      }
}