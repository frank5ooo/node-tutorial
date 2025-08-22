"use server";

import { prisma } from "@/app/lib/prisma";
import { actionClient } from "@/app/lib/safe-action";
import { z } from "zod";


const FormSchema = z.object({
  id: z.string(),
});

export const fetchInvoiceById = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {
  try {
    const data = await prisma.invoice.findUnique({
      where: { id: parsedInput.id },
      select: {
        id: true,
        customer_id: true,
        status: true,
        date: true,
        products: true,
      },
    });

    if (!data) return null;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
    }
  });
