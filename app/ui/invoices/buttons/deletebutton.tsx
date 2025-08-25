"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteInvoice } from "@/app/lib/actions/invoice/deleteInvoice";

export function DeleteInvoice({ id }: { id: string }) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      id,
    };

    try {
      const result = await deleteInvoice(dataToSend);

      if (result?.serverError) {
        console.error(result?.serverError);
      } else {
        console.debug("Producto Creado");
      }
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
