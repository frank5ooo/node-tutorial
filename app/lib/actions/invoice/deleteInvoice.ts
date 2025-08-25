"use server";

import { prisma } from "@/app/lib/prisma";
import { actionClient } from "../../safe-action";
import z from "zod";
import { revalidatePath } from "next/cache";

const FormSchema = z.object({
  id: z.string().uuid(),
});

export const deleteInvoice = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {
    await prisma.invoice.delete({
      where: {
        id: parsedInput.id,
      },
    });
    revalidatePath("/dashboard/invoices");
  });
