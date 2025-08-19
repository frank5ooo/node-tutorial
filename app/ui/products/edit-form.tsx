"use client";

import { ProductsField } from "@/app/lib/definitions";
import {
  CheckIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { useState } from "react";
import { updateProduct } from "@/app/lib/actions/product/updateProduct";
import { Product } from "@prisma/client";

export default function EditInvoiceForm({
  products,
}: {
  products: Pick<Product, "id" | "name" | "price">[];
}) {
  const [formData, setFormData] = useState({
    id: products[0].id,
    name: products[0].name,
    price: products[0].price,
  });

  console.log(formData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await updateProduct(formData);

      if (result?.serverError) {
        console.error(result?.serverError);
      } else {
        console.debug("Producto Creado");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Product */}
        <div className="mb-4">
          <label htmlFor="product" className="mb-2 block text-sm font-medium">
            Choose product
          </label>
          <div className="relative">
            
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Invoice</Button>
      </div>
    </form>
  );
}
