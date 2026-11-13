import { shippingAddressSchema } from "@/features/cart/types/shipping.validator"
import { PAYMENT_METHODS } from "@/features/payment/constants/payment.constants"
import z from "zod"

export const insertOrderSchema = z.object({
    userId: z.string(),
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.enum(PAYMENT_METHODS),
    itemsPrice: z.coerce.number().int().nonnegative(),
    shippingPrice: z.coerce.number().int().nonnegative(),
    totalPrice: z.coerce.number().int().nonnegative(),
})

export const insertOrderItemSchema = z.object({
    productId: z.string(),
    slug: z.string(),
    image: z.string(),
    name: z.string(),
    price: z.coerce.number().int().nonnegative(),
    qty: z.coerce.number().int().positive(),
})
