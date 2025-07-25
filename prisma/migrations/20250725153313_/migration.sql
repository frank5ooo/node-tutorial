/*
  Warnings:

  - You are about to drop the column `amount` on the `invoices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "amount";

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "invoice_id" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
