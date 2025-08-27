"use server";

import { prisma } from "@/app/lib/prisma";

export async function fetchProductsWithNoId() {
  try {
    const product = await prisma.product.findMany({
      where: {
        invoice_id: null,
      },
      select: {
        id: true,
        name: true,
        invoice_id: true,
      },
    });

    return product;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all product.");
  }
}