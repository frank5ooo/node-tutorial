"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteProduct } from "@/app/lib/actions/product/deleteProduct";
import { fetchProducts } from "@/app/lib/actions";
import { deleteInvoice } from "@/app/lib/actions/invoice/deleteInvoice";

type DeleteButtonProps = {
  id: string;
  invoice_id: string | null;
};

export function DeleteProduct({ id, invoice_id }: DeleteButtonProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      id,
    };

    try {
      console.log("entrssa");
      const result = await deleteProduct(dataToSend);

      if (result?.serverError) {
        console.error(result?.serverError);
      } else {
        console.debug("Producto Eliminado");
      }
      
      if (!invoice_id) return null;
      const cantVehicules = await fetchProducts(invoice_id);
      console.log("cantVehicules1", cantVehicules.length);

      if (cantVehicules.length === 1) {
        const resultInvoice = await deleteInvoice({ id: invoice_id });

        if (resultInvoice?.serverError) {
          console.error(resultInvoice?.serverError);
        } else {
          console.debug("Producto Eliminado");
        }
      }
    } catch (error) {
      console.log(error);
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
