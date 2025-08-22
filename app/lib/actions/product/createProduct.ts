"use server";

import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { actionClient } from "../../safe-action";

const FormSchemaProduct = z.object({
  name: z.string(),
  price: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
});

export const createProduct = actionClient
  .inputSchema(FormSchemaProduct)
  .action(async ({ parsedInput }) => {
    const priceInCents = parsedInput.price * 100;

    try {
      await prisma.product.create({
        data: {
          invoice_id: null,
          name: parsedInput.name,
          price: priceInCents,
        },
      });
    } catch (error) {
      console.error("Error Prisma:", error);
    }
  });
