'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from './prisma';

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

export async function deleteInvoice(id: string) {
  await prisma.invoice.delete({
    where: {
      id
    },
  });

  revalidatePath('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  }
  catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

const FormSchemaProduct = z.object({
  id: z.string(),
  name: z.string(),
  price: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
});

const CreateProduct = FormSchemaProduct.omit({ id: true });

export async function createProduct(prevState: StateProduct, formData: FormData) {
  const validatedFields = CreateProduct.safeParse({
    price: formData.get('price'),
    name: formData.get('name')
  });

  console.log(createProduct);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product.',
    };
  }

  const { name, price } = validatedFields.data;
  const priceInCents = price * 100;

  try {
    await prisma.product.create({
      data: {
        invoice_id: null,
        name,
        price: priceInCents,
      },
    });
  }
  catch (error) {
    console.error("Error Prisma:", error);
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

const UpdateProduct = FormSchemaProduct.omit({ id: true });

export async function updateProduct(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateProduct.safeParse({
    price: formData.get('price'),
    name: formData.get('name')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { price, name } = validatedFields.data;

  try {
    await prisma.product.update({
      where: {
        id,
      },
      data: {
        price,
        name
      },
    });

  }
  catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: {
      id
    },
  });

  revalidatePath('/dashboard/products');
}

export async function fetchProducts(id:string) 
{
  try 
  {
    const product = await prisma.product.findMany({
      where:
      {
        invoice_id: id,
      },
      select:
      {
        name: true,
        price: true, 
      }
    });

    return product;
  } 
  catch (err) 
  {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all product.');
  }
}