"use server";

import { prisma } from "@/app/lib/prisma";
import { actionClient } from "../../safe-action";
import z from "zod";
import { revalidatePath } from "next/cache";

const FormSchema = z.object({
  id: z.string(),
});

export const deleteProduct = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {

    console.log("entra");

    await prisma.product.delete({
      where: {
        id: parsedInput.id,
      },
    });
    revalidatePath("/dashboard/product");
  });
