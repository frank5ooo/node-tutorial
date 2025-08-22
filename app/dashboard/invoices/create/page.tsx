import Form from "@/app/ui/invoices/create-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data/fetch-customer";
import { fetchProductsWithNoId } from "@/app/lib/data/fetch-products-with-no-id";
export default async function Page() {
  const customers = await fetchCustomers();
  const products = await fetchProductsWithNoId();

  const options = products.map((product) => ({
    id: product.id.toString(),
    name: product.name,
  }));

  // console.debug("options", options);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Create Invoice",
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      />
      <Form customers={customers} products={options} />
    </main>
  );
}
