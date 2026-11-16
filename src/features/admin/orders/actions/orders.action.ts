"use server";

import { revalidatePath } from "next/cache";

import type { Order } from "@/features/order/types/orderType";
import { prisma } from "@/lib/prisma";
import { PAGE_SIZE } from "@/lib/utils";
import { toActionError } from "@/utils/actionError";

import type { SalesDataType } from "../types/OrdersTypes";

export async function getOrderSummery(){
    const ordersCount = await prisma.order.count()
    const usersCount = await prisma.user.count()
    const productsCount = await prisma.product.count()

    const totalSales = await prisma.order.aggregate({
        _sum:{totalPrice: true}
    })

    const orders = await prisma.order.findMany({
        select:{
            createdAt: true,
            totalPrice: true
        },
        orderBy: {createdAt: "asc"}
    })

    const monthlyData = new Map<string, number>()

    orders.forEach((order) => {
        const data = new Date(order.createdAt)
        const month = String(data.getMonth() + 1).padStart(2, "0")
        const year = String(data.getFullYear()).slice(-2)
        const monthKey = `${month}/${year}`

        const currentTotal = monthlyData.get(monthKey) || 0
        monthlyData.set(monthKey, currentTotal + order.totalPrice)
    })

    const SalesData: SalesDataType[] = Array.from(monthlyData.entries()).map(([month, totalSales]) => ({
        month,
        totalSales
    }),
    )

    const latesSales = await prisma.order.findMany({
        orderBy: {createdAt: "desc"},
        include:{
            user: {select: {name: true}}
        },
        take: 6
    })

    return {
        ordersCount,
        productsCount,
        usersCount,
        totalSales,
        latesSales,
        SalesData
    }
}

export async function getAllOrders({limit = PAGE_SIZE, page}: {limit?: number, page: number}){
    const data = await prisma.order.findMany({
        orderBy: {createdAt: "desc"},
        take: limit,
        skip: (page - 1) * limit,
        include: {user: {select: {name: true}}}
    })

    const dataCount = await prisma.order.count()

    return{
        data,
        totalPage: Math.ceil(dataCount / limit)
    }
}

export async function getOrderById(orderId: string) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderitems: true,
                user: { select: { name: true, email: true } }
            }
        })

        return (order as Order | null) ?? null
    } catch (error) {
        console.error("Failed to fetch order:", error)
        return null
    }
}

export async function deleteOrder(id: string) {
    try {
        await prisma.order.delete({ where: { id } })

        revalidatePath("/admin/orders")

        return { data: { id } }
    } catch (error) {
        console.error("Failed to delete order:", error)
        return toActionError(error, "ORDER_DELETE_FAILED")
    }
}

export async function updateOrderToPaidCOD(orderId:string) {
    try {
        const paidAt = new Date()

        const order = await prisma.order.update({
            where: {id: orderId},
            data: {
                isPaid: true,
                paidAt,
                paymentResult: {
                    id: `cod_${paidAt.getTime()}`,
                    status: "COMPLETED",
                    update_time: paidAt.toISOString(),
                    email: null
                }
            }
        })

        revalidatePath("/admin/orders")
        revalidatePath(`/admin/orders/${orderId}`)

        return { data: { id: order.id } }
    } catch (error) {
        console.error("Failed to mark order as paid:", error)
        return toActionError(error, "ORDER_UPDATE_FAILED")
    }
}

export async function deliverOrder(orderId:string) {
    try {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                isDelivered: true,
                deliveredAt: new Date()
            }
        })

        revalidatePath("/admin/orders")
        revalidatePath(`/admin/orders/${orderId}`)

        return { data: { id: order.id } }
    } catch (error) {
        console.error("Failed to mark order as delivered:", error)
        return toActionError(error, "ORDER_UPDATE_FAILED")
    }
}