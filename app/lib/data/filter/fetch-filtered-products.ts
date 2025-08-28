import { prisma } from "@/app/lib/prisma";
import { actionClient } from "@/app/lib/safe-action";
import { redirect } from "next/navigation";
import { z } from "zod";

const ITEMS_PER_PAGE = 6;

const FormSchema = z.object({
  currentPage: z.number(),
  query: z.string(),
  status: z.string().optional(),
});

export const fetchFilteredProducts = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {
    const offset = (parsedInput.currentPage - 1) * ITEMS_PER_PAGE;
    const maybePrice = Number(parsedInput.query) * 100;
    const isNumber = !isNaN(maybePrice);

    try {
      const products = await prisma.product.findMany({
        take: ITEMS_PER_PAGE,
        skip: offset,
        where: {
          ...(parsedInput.status && parsedInput.status == "Sell"
            ? { invoice_id: { not: null } }
            : {}),

          ...(parsedInput.status && parsedInput.status == "OnStock"
            ? { invoice_id: { equals: null } }
            : {}),

          ...(parsedInput.query && parsedInput.query !== ""
            ? {
                OR: [
                  {
                    name: { contains: parsedInput.query, mode: "insensitive" },
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
        orderBy: {
          invoice_id: "asc",
        },
      });


      

      return products;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch products.");
    }
  });
