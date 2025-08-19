"use client";

import { useAction } from "next-safe-action/hooks";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteInvoice } from "@/app/lib/actions/invoice/deleteInvoice";

export function DeleteInvoice({ id }: { id: string }) {
  const { executeAsync, hasErrored } = useAction(deleteInvoice);

  async function handleSubmit(formData: FormData) {
    // Validaciones custom del front

    try {
      const invoiceId = formData.get("invoiceId") as string;
      const { data, ...errors } = await executeAsync({ invoiceId });
      if (errors.validationErrors || errors.serverError) {
        throw errors;
      }
    } catch (errors) {
      console.log(errors);
    }
  }

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="invoiceId" value={id} />

      {hasErrored && "AHHHHHHHHHHH"}
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
