"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export type State = {
  message?: string | null;
  errors?: {
    customerId?: string[];
    status?: string[];
  };
};

export type StateProduct = {
  errors?: {
    name?: string[];
    price?: string[];
  };
  message?: string | null;
};

export async function fetchProducts(id: string) {
  try {
    const product = await prisma.product.findMany({
      where: {
        invoice_id: id,
      },
      select: {
        name: true,
        price: true,
      },
    });

    // console.log("id fetch", id);

    // console.log("fetchproduct", product);
    return product;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all product.");
  }
}
