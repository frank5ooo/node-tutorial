'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from './prisma';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

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

const UpdateInvoice = z.object({
  customerId: z.string().nonempty(),
  status: z.string().nonempty(),
  // product: z.array(z.string().nonempty()), // Asegúrate de que 'product' sea un array de strings
});

export async function updateInvoice(id: string, prevState: State, formData: FormData)
{
  const productRaw = formData.get("productIds") as string;
  const selectedIds = productRaw
    ? productRaw.split(",").filter(Boolean)
    : [];

  console.log("selectedIds", selectedIds);

  const currentProducts = await prisma.product.findMany({
    where: 
    { 
      invoice_id: id 
    },
    select: 
    { 
      id: true 
    },
  });

  const currentIds = currentProducts.map((p) => p.id);
  
  console.log("currentIds", currentIds);

  // Productos que se asignarán a la factura
  const toAdd = selectedIds.filter((productId) => !currentIds.includes(productId));

  console.log("toadd", toAdd);

  // Productos que se desasignarán de la factura
  const toRemove = currentIds.filter((productId) => !selectedIds.includes(productId));
  
  console.log("toRemove", toRemove);

  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, status } = validatedFields.data;

  try {
    await prisma.$transaction([
      // Asignar factura a productos nuevos
      ...toAdd.map((productId) =>
        prisma.product.update({
          where: { id: productId },
          data: { invoice_id: id }, // Aquí va el invoice id (id)
        })
      ),
      // Desasignar factura de productos removidos
      ...toRemove.map((productId) =>
        prisma.product.update({
          where: { id: productId },
          data: { invoice_id: null },
        })
      ),
      // Actualizar datos de la factura
      prisma.invoice.update({
        where: { id },
        data: {
          customer_id: customerId,
          status,
          // Ya no es necesario conectar productos aquí, porque lo haces en productos directamente
        },
      }),
    ]);

    
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

}


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