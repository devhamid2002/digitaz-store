import { z } from "zod";

export const cartItemSchema = z.object({
    productId: z.string(),
    name: z.string(),
    slug: z.string(),
    qty: z.string(),
    image:z.string(),
    price: z.coerce.number(),
    // Selected variant; null when the product has no color/size options
    color: z.string().nullable().optional(),
    size: z.string().nullable().optional(),
})

// Identity of one cart line: what makes two items the same row
export const cartLineKeySchema = cartItemSchema.pick({
    productId: true,
    color: true,
    size: true,
})

export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: z.string(),
    totalPrice: z.string(),
    shippingPrice: z.string(),
    sessionCardId: z.string(),
    userId: z.string().optional().nullable() 
})