import { z } from "zod";
import { cartItemSchema, insertCartSchema, cartLineKeySchema } from "./cart.validator";

export type Cart = z.infer<typeof insertCartSchema>
export type CartItem = z.infer<typeof cartItemSchema>
// Lowercase alias: single-item type used by addItemToCart / AddtoCart
export type cartItem = CartItem
// Identity of one cart line (productId + selected variant)
export type cartLineKey = z.infer<typeof cartLineKeySchema>
// Server-cart snapshot threaded from the page: only the line items are read
export type cartSnapshot = { items: cartItem[] }