"use client";

import {
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { useState } from "react";
import { updateProduct } from "@/app/lib/actions/product/updateProduct";
import { Product } from "@prisma/client";
import { MakePartial } from "@/app/lib/utils";
import { NumberInput } from "../number-input";
import { useRouter } from "next/navigation";

type ProductData = Pick<Product, "id" | "name" | "price">;

export default function EditInvoiceForm({
  products,
}: {
  products: ProductData[];
}) {
  const [formData, setFormData] = useState<MakePartial<ProductData, "price">>({
    id: products[0].id,
    name: products[0].name,
    price: products[0].price,
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      id: formData.id,
      name: formData.name,
      price: formData.price as number,
    };

    try {
      const result = await updateProduct(dataToSend);

      if (result?.serverError) {
        console.error(result?.serverError);
      } else {
        router.push("/dashboard/products");
      }
    } catch (error) {
      console.error(error);
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
            <input
              id="name"
              name="name"
              type="text"
              step="0.01"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="product-error"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              required
            />
          </div>
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <NumberInput
                id="price"
                name="price"
                type="text"
                placeholder="Enter USD price"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="price-error"
                initialValue={formData.price && formData.price / 100}
                onChange={(newPrice) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: newPrice && newPrice * 100,
                  }))
                }
                required
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Invoice</Button>
      </div>
    </form>
  );
}
