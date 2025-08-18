"use server";

import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { actionClient } from "@/app/lib/safe-action";
import { zfd } from "zod-form-data";

const FormSchema = zfd.formData({
  customerId: zfd.text(),
  status: zfd.text().transform((val) => z.enum(["pending", "paid"]).parse(val)),
  productIds: zfd.text().transform((val) => val.split(",")),
});

export const createInvoice = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {
    try {
      await prisma.invoice.create({
        data: {
          customer_id: parsedInput.customerId,
          status: parsedInput.status,
          date: new Date(),
          products: {
            connect: parsedInput.productIds.map((id: string) => ({ id })),
          },
        },
      });
    } catch (error) {
      console.error("Error Prisma:", error);
    }
  });
