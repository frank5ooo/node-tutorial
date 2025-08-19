"use client";

import Link from "next/link";
import { CurrencyDollarIcon, TruckIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { useState } from "react";
import { createProduct } from "@/app/lib/actions/product/createProduct";

type ProductForm = {
  product: {
    name: string;
    price: string;
  };
};

export default function Form({ product }: ProductForm) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      name: formData.name,
      price: Number(formData.price),
    };

    try {
      const result = await createProduct(dataToSend);

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
      {/* Customer Name */}
      <div className="mb-4">
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Choose product
        </label>
        <div className="relative">
          <input
            id="name"
            name="name"
            type="text"
            step="0.01"
            placeholder="Enter products"
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
          <TruckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>

      {/* Invoice price */}
      <div className="mb-4">
        <label htmlFor="price" className="mb-2 block text-sm font-medium">
          Choose an amount
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              placeholder="Enter USD price"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="price-error"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              required
            />
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
        <Button type="submit">Create Product</Button>
      </div>
    </form>
  );
}
