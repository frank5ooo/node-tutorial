import { prisma } from "@/app/lib/prisma";
import { actionClient } from "@/app/lib/safe-action";
import { z } from "zod/v4";
import { payloadSchema } from "../../definitions";

const FormSchema = payloadSchema(
  z.object({
    query: z.string(),
  })
);

export const fetchProductPages = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {
    const { data, pagination } = parsedInput;

    try {
      const total = await prisma.product.count({
        where: {
          name: { contains: data.query, mode: "insensitive" },
        },
        orderBy: {
          price: "desc",
        },
      });

      const perPage = pagination.perPage;
      const totalPages = Math.ceil(total / perPage);
      // console.log("totalPages fetch", totalPages);
      return totalPages;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch total number of invoices.");
    }
  });
