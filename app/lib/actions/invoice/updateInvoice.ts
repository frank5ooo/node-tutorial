"use server";

import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { actionClient } from "@/app/lib/safe-action";
import { zfd } from "zod-form-data";

const FormSchema = zfd.formData({
  invoiceId: zfd.text(),
  customerId: zfd.text(),
  status: zfd.text().transform((val) => z.enum(["pending", "paid"]).parse(val)),
  productIds: zfd.text().transform((val) => val.split(",").filter(Boolean)),
});

export const updateInvoice = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {
    const selectedIds = parsedInput.productIds;

    // console.log("selectedIds", selectedIds);

    const currentProducts = await prisma.product.findMany({
      where: {
        invoice_id: parsedInput.invoiceId,
      },
      select: {
        id: true,
      },
    });

    const currentIds = currentProducts.map((p) => p.id);

    // console.log("currentIds", currentIds);

    const toAdd = selectedIds.filter(
      (productId) => !currentIds.includes(productId)
    );

    // console.log("toadd", toAdd);

    const toRemove = currentIds.filter(
      (productId) => !selectedIds.includes(productId)
    );

    // console.log("toRemove", toRemove);

    try {
      /*
      prisma.invoice.update({
        where: { id: parsedInput.invoiceId },
        data: {
          customer_id: parsedInput.customerId,
          status: parsedInput.status,
          products: {
            connect: toAdd.map((id) => ({ id })),
            disconnect: toRemove.map((id) => ({ id })),
          },
        },
      });
      /*/
      await prisma.$transaction([
        ...toAdd.map((productId) =>
          prisma.product.update({
            where: { id: productId },
            data: { invoice_id: parsedInput.invoiceId },
          })
        ),
        ...toRemove.map((productId) =>
          prisma.product.update({
            where: { id: productId },
            data: { invoice_id: null },
          })
        ),
        prisma.invoice.update({
          where: { id: parsedInput.invoiceId },
          data: {
            customer_id: parsedInput.customerId,
            status: parsedInput.status,
          },
        }),
      ]);
      //*/
    } catch (error) {
      return { message: "Database Error: Failed to Update Invoice." };
    }
  });
