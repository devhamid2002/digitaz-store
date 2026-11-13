-- Rename the misspelled delivery columns on Order
ALTER TABLE "Order" RENAME COLUMN "isDeliverd" TO "isDelivered";
ALTER TABLE "Order" RENAME COLUMN "deliverdAt" TO "deliveredAt";
