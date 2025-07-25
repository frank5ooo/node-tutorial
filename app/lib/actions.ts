'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import postgres from 'postgres';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from './prisma';
 
// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData)
{
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  
  console.log(validatedFields);

  if (!validatedFields.success) 
  {
    return {
    errors: validatedFields.error.flatten().fieldErrors,
    message: 'Missing Fields. Failed to Create Invoice.',
    };   
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  // const date = new Date().toISOString().split('T')[0];
  const date = new Date();

  try 
  {
    // await sql
    //     INSERT INTO invoices (customer_id, amount, status, date)
    //     VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    // ;

    await prisma.invoice.create({ 
      data: {
        amount: amountInCents,
        customer_id: customerId,
        status,
        date,
      },
    });
  }
  catch (error) 
  {
    console.error("Error Prisma:", error);
  } 
  
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) 
{
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success)
  {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try 
  {
    // await sql`
    //   UPDATE invoices
    //   SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    //   WHERE id = ${id}
    // `;
    await prisma.invoice.update({
      where: {
        id,
      },
      data: {
        amount: amountInCents,
        customer_id: customerId,
        status: status,
      },
    });
    console.debug("id", id)
  } 
  catch (error) 
  {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function deleteInvoice(id: string) 
{
  // throw new Error('Failed to Delete Invoice');
 
  // Unreachable code block
  // await sql`DELETE FROM invoices WHERE id = ${id}`;
  await prisma.invoice.delete({
    where: {
      id // el ID del invoice a actualizar
    },
  });

  revalidatePath('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
)
{
  try 
  {
    await signIn('credentials', formData);
  } 
  catch (error) 
  {
    if (error instanceof AuthError) 
    {
      switch (error.type) 
      {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}