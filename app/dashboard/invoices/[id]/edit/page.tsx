import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { fetchInvoiceById } from "@/app/lib/data/fetch-invoide-by-id";
import { notFound } from "next/navigation";
import { fetchProductsWithNoId } from "@/app/lib/data/fetch-products-with-no-id";
import { fetchCustomers } from "@/app/lib/data/fetch-customer";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [invoice, customers, products] = await Promise.all([
    fetchInvoiceById({id}),
    fetchCustomers(),
    fetchProductsWithNoId(),
  ]);

  if (!invoice.data) {
    notFound();
  }

    console.log("invoice",invoice);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice.data} customers={customers} products={products} />
    </main>
  );
}
