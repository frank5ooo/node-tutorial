'use client';

import Link from 'next/link';
import {
  CurrencyDollarIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createProduct, StateProduct } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function Form() 
{
  const initialState: StateProduct = { message: null, errors: {} };
  const [stateProduct, formAction] = useActionState(createProduct, initialState);

  return (
    <form action={formAction}>
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
          />
          <TruckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
        <div id="product-error" aria-live="polite" aria-atomic="true">
          {
            stateProduct.errors?.name &&
              stateProduct.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
            ))
          }
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
            />
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="price-error" aria-live="polite" aria-atomic="true">
          {
            stateProduct.errors?.price && stateProduct.errors.price.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))
          }
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