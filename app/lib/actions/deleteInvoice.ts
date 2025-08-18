
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from "@/app/lib/prisma";
import { actionClient } from '../safe-action';


const FormSchema = z.object({
  invoiceId: z.string(),
});

export const updateInvoice = actionClient
  .inputSchema(FormSchema)
  .action(async ({ parsedInput }) => {  
    await prisma.invoice.delete({
    where: {
      id: parsedInput.invoiceId
    },
  });


});
