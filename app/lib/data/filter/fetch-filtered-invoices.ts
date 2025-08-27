import { prisma } from "@/app/lib/prisma";
import { actionClient } from "@/app/lib/safe-action";
import { z } from "zod";

const ITEMS_PER_PAGE = 6;

const FormSchema = z.object({
  currentPage: z.number(),
  query: z.string(),
});

export const fetchFilteredInvoices = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {
    const offset = (parsedInput.currentPage - 1) * ITEMS_PER_PAGE;
    const maybePrice = Number(parsedInput.query) * 100;
    const isNumber = !isNaN(maybePrice);

    try {
      const invoices = await prisma.invoice.findMany({
        take: ITEMS_PER_PAGE,
        skip: offset,
        select: {
          customer: true,
          date: true,
          status: true,
          id: true,
          products: {
            select: {
              price: true,
            },
          },
        },
        where: {
          OR: [
            {
              customer: {
                name: { contains: parsedInput.query, mode: "insensitive" },
              },
            },
            {
              customer: {
                email: { contains: parsedInput.query, mode: "insensitive" },
              },
            },
            { status: { contains: parsedInput.query, mode: "insensitive" } },
            ...(isNumber
              ? [
                  {
                    products: {
                      some: {
                        price: {
                          equals: maybePrice,
                        },
                      },
                    },
                  },
                ]
              : []),
          ],
        },
        orderBy: { date: "desc" },
      });

      return invoices.map(({ products, ...invoice }) => {
        const price = products.reduce((sum, prod) => sum + Number(prod.price), 0);
        return {
          ...invoice,
          price,
        };
      });
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch invoices.");
    }
  });

  