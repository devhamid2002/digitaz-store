-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Address_userId_idx" ON "Address"("userId");

-- Move the single legacy JSON address on User into the new table so existing
-- customers keep their delivery address after the upgrade.
INSERT INTO "Address" (
    "id",
    "userId",
    "label",
    "fullName",
    "city",
    "streetAddress",
    "postalCode",
    "country",
    "isDefault",
    "createdAt",
    "updatedAt"
)
SELECT
    lower(hex(randomblob(16))),
    "id",
    'Home',
    json_extract("address", '$.fullName'),
    json_extract("address", '$.city'),
    json_extract("address", '$.streetAddress'),
    json_extract("address", '$.postalCode'),
    json_extract("address", '$.country'),
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "User"
WHERE "address" IS NOT NULL
  AND json_valid("address")
  AND length(trim(coalesce(json_extract("address", '$.fullName'), ''))) > 0
  AND length(trim(coalesce(json_extract("address", '$.city'), ''))) > 0
  AND length(trim(coalesce(json_extract("address", '$.streetAddress'), ''))) > 0
  AND length(trim(coalesce(json_extract("address", '$.postalCode'), ''))) > 0
  AND length(trim(coalesce(json_extract("address", '$.country'), ''))) > 0;

-- The normalized Address table is now the source of truth.
ALTER TABLE "User" DROP COLUMN "address";
