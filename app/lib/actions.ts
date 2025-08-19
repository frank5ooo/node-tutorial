"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

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

const FormSchemaProduct = z.object({
  id: z.string(),
  name: z.string(),
  price: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
});

const UpdateProduct = FormSchemaProduct.omit({ id: true });

export async function updateProduct(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateProduct.safeParse({
    price: formData.get("price"),
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
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
        name,
      },
    });
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice." };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: {
      id,
    },
  });

  revalidatePath("/dashboard/products");
}

export async function fetchProducts(id: string) {
  try {
    const product = await prisma.product.findMany({
      where: {
        invoice_id: id,
      },
      select: {
        name: true,
        price: true,
      },
    });

    console.log("id fetcg", id);

    console.log("fetchproduct", product);
    return product;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all product.");
  }
}
