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

export const fetchInvoicesPages = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {
    const { data, pagination } = parsedInput;

    const maybePrice = Number(data.query) * 100;
    const isNumber = !isNaN(maybePrice);

    // console.log("data", data.status);

    const filters: any = {
      ...(data && data.status
        ? { status: { equals: data.status, mode: "insensitive" } }
        : {}),
      ...(data && data.status
        ? {
            AND: [
              {
                OR: [
                  {
                    customer: {
                      name: { contains: data.query, mode: "insensitive" },
                    },
                  },
                  {
                    customer: {
                      email: { contains: data.query, mode: "insensitive" },
                    },
                  },
                  { status: { contains: data.query, mode: "insensitive" } },
                  ...(isNumber
                    ? [
                        {
                          products: { some: { price: { equals: maybePrice } } },
                        },
                      ]
                    : []),
                ],
              },
            ],
          }
        : {}),
    };

    try {
      const totalItems = await prisma.invoice.count({
        where: filters,
      });

      const totalPages = Math.ceil(totalItems / pagination.perPage);
      // console.log("totalPages 1111", totalItems);

      return totalPages;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch invoices.");
    }
  });
