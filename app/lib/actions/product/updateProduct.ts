"use server";

import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { actionClient } from "../../safe-action";






const FormSchemaProduct = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
});

export const updateProduct = actionClient
  .inputSchema(FormSchemaProduct)
  .action(async ({ parsedInput }) => {
    try {
      await prisma.product.update({
        where: {
          id: parsedInput.id,
        },
        data: {
          price: parsedInput.price,
          name: parsedInput.name,
        },
        
      });
    } catch (error) {
      return { message: "Database Error: Failed to Update Invoice." };
    }
  });
