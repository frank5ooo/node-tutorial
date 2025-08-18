'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';

export type State = {
  message?: string | null;
  errors?: {
    customerId?: string[];
    status?: string[];
  };
};

export type StateProduct = {
  errors?: {
    name?: string[];
    price?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.date(),
  product: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) 
{
  const productIdsRaw = formData.get('productIds') as string;
  const product = productIdsRaw
    .split(',')                
    .map((id) => id.trim())
    .filter(Boolean);

  console.debug(product);

  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    status: formData.get('status'),
    product: formData.get('productIds'),
  });
  
  console.debug(validatedFields.error);
  
  if (!validatedFields.success) 
  {
    return {
      message: 'Missing Fields. Failed to Create Invoice.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { customerId, status, /*product*/ } = validatedFields.data;
  const date = new Date();
  
  console.debug(validatedFields.data);

  try 
  {
    await prisma.invoice.create({
      data: 
      {
        customer_id: customerId,
        status,
        date,
        products: {
          connect: product.map((id: string) => ({ id })),
        },
      }
    });
  }
  catch (error) {
    console.error("Error Prisma:", error);
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}