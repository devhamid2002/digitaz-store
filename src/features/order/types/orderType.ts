import z from 'zod'
import { insertOrderItemSchema, insertOrderSchema } from './order.validator'

export type OrderItem = z.infer<typeof insertOrderItemSchema>

export type Order = z.infer<typeof insertOrderSchema> & {
    id: string;
    createdAt: Date;
    isPaid: boolean;
    paidAt: Date | null;
    isDelivered: boolean;
    deliveredAt: Date | null;
    orderitems: OrderItem[];
    user: {
      name: string;
      email: string | null;
    } | null;
  };
