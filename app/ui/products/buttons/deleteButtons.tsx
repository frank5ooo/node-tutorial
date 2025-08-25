"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteProduct } from "@/app/lib/actions/product/deleteProduct";
import { fetchProductsByInvoiceId } from "@/app/lib/data/fetch-products-by-invoiceId";
import { deleteInvoice } from "@/app/lib/actions/invoice/deleteInvoice";

type DeleteButtonProps = {
  id: string;
  invoice_id: string | null;
};

export function DeleteProduct({ id, invoice_id }: DeleteButtonProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await deleteProduct({id});

      if (result?.serverError) {
        console.error(result?.serverError);
      } else {
        console.debug("Producto Eliminado");
      }
      
      if (!invoice_id) return null;
      const cantVehicules = await fetchProductsByInvoiceId({id:invoice_id});
      // console.log("cantVehicules1", cantVehicules.data?.length);

      if (cantVehicules.data?.length === 0) {
        const resultInvoice = await deleteInvoice({ id: invoice_id });

        if (resultInvoice?.serverError) {
          console.error(resultInvoice?.serverError);
        } else {
          console.debug("Producto Eliminado");
        }
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
