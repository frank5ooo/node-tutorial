import Form from "@/app/ui/products/edit-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { notFound } from "next/navigation";
import { fetchProductsById } from "@/app/lib/data/fetch-products-by-id";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const product = await fetchProductsById({ id });
  if (!product) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Products", href: "/dashboard/products" },
          {
            label: "Edit Invoice",
            href: `/dashboard/products/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form products={product.data ? [product.data] : []} />
    </main>
  );
}
