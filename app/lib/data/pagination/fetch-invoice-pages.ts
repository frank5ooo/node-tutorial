import { prisma } from "@/app/lib/prisma";
import { actionClient } from "@/app/lib/safe-action";
import { z } from "zod";

const ITEMS_PER_PAGE = 6;

const FormSchema = z.object({
  query: z.string(),
});

export const fetchInvoicesPages = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const data = await prisma.invoice.count({
        where: {
          OR: [
            {
              customer: {
                name: { contains: parsedInput.query, mode: "insensitive" },
              },
            },
          ],
        },
      });

      const totalPages = Math.ceil(Number(data) / ITEMS_PER_PAGE);
      return totalPages;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch total number of invoices.");
    }
  });
