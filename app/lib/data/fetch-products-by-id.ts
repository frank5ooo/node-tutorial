"use server";

import { prisma } from "@/app/lib/prisma";
import { actionClient } from "@/app/lib/safe-action";
import { z } from "zod";

const FormSchema = z.object({
  id: z.string(),
});

export const fetchProductsById = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: parsedInput.id,
        },
        select: {
          id: true,
          name: true,
          price: true,
        },
      });

      return product;
    } catch (err) {
      console.error("Database Error:", err);
      throw new Error("Failed to fetch all product.");
    }
  });
