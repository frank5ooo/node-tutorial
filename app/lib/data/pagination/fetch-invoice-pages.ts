import { prisma } from "@/app/lib/prisma";
import { actionClient } from "@/app/lib/safe-action";
import { z } from "zod/v4";
import { payloadSchema } from "../../definitions";

const FormSchema = payloadSchema(
  z.object({
    query: z.string(),
  })
);

// type A=z.input<typeof FormSchema>

export const fetchInvoicesPages = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {
    const { data, pagination } = parsedInput;

    // console.log("data", data);

    try {
      const total = await prisma.invoice.count({
        where: {
          customer: {
            name: { contains: data.query, mode: "insensitive" },
          },
        },
      });

        // console.log("total", total);

      const perPage = pagination.perPage;
      const totalPages = Math.ceil(total / perPage);
      // console.log("totalPages fetch", totalPages);
      return totalPages;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch total number of invoices.");
    }
  });
