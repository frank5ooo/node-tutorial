import { prisma } from "@/app/lib/prisma";
import { actionClient } from "@/app/lib/safe-action";
import { z } from "zod/v4";
import { payloadSchema } from "../../definitions";

const FormSchema = payloadSchema(
  z.object({
    query: z.string(),
    status: z.string(),
  })
);

export const fetchProductPages = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {
    const { data, pagination } = parsedInput;

    const maybePrice = Number(data.query) * 100;
    const isNumber = !isNaN(maybePrice);

    try {
      const total = await prisma.product.count({
        where: {
          ...(data.status && data.status == "Sell"
            ? { invoice_id: { not: null } }
            : {}),

          ...(data.status && data.status == "OnStock"
            ? { invoice_id: { equals: null } }
            : {}),

          ...(data.query && data.query !== ""
            ? {
                OR: [
                  {
                    name: { contains: data.query, mode: "insensitive" },
                  },
                  ...(isNumber
                    ? [
                        {
                          price: {
                            equals: maybePrice,
                          },
                        },
                      ]
                    : []),
                ],
              }
            : {}),
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
