"use client";

import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  UserCircleIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { State } from "@/app/lib/actions";
import { Customer, Invoice, Product } from "@prisma/client";
import { MultiSelect } from "primereact/multiselect";
import { ReactEventHandler, useActionState, useState } from "react";
import { createInvoice } from "@/app/lib/actions/createInvoice";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";

type SelectOption = {
  id: string;
  name: string;
};

export default function Form({
  customers,
  products,
}: {
  customers: Pick<Customer, "id" | "name">[];
  products: Pick<Product, "id" | "name">[];
}) {
  const [selectedProducts, setSelectedProducts] = useState<SelectOption[]>([]);
  const { executeAsync, hasErrored } = useAction(createInvoice);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    // Validaciones custom del front
    console.log(formData.get("customerId"));
    try {
      const { data, ...errors } = await executeAsync(formData);
      if (errors.validationErrors || errors.serverError) {
        throw errors;
      } else {
        router.push("/dashboard/invoices");
      }
    } catch (errors) {
      console.log(errors);
    }
  }

  return (
    <form action={handleSubmit}>
      {hasErrored && "AHHHHHHHHHHH"}

      {/* Customer Name */}
      <div className="mb-4">
        <label htmlFor="customer" className="mb-2 block text-sm font-medium">
          Choose customer
        </label>
        <div className="relative">
          <select
            id="customer"
            name="customerId"
            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            defaultValue=""
            aria-describedby="customer-error"
          >
            <option value="" disabled>
              Select a customer
            </option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
        <div id="customer-error" aria-live="polite" aria-atomic="true">
          {/* {customers.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))} */}
        </div>
      </div>

      {/* Invoice Product */}
      <div className="mb-4">
        <label htmlFor="product" className="mb-2 block text-sm font-medium">
          Choose a product
        </label>
        <div className="relative">
          <MultiSelect
            value={selectedProducts}
            onChange={(e) => setSelectedProducts(e.value)}
            options={products}
            optionLabel="name"
            placeholder="Select products"
            className="w-full md:w-20rem ms-6"
          />
          <TruckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
        <input
          type="hidden"
          name="productIds"
          value={selectedProducts.map((p) => p.id).join(",")}
        />
        <div id="customer-error" aria-live="polite" aria-atomic="true">
          {/* {state.errors?.customerId &&
            state.errors.customerId.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))} */}
        </div>
      </div>

      {/* Invoice Status */}
      <div className="mb-4">
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
              <div id="status-error" aria-live="polite" aria-atomic="true">
                {/* {state.errors?.status &&
                  state.errors.status.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))} */}
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" name="submit">
          Create Invoice
        </Button>
      </div>
    </form>
  );
}
