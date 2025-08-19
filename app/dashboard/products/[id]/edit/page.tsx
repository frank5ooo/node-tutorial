import Form from "@/app/ui/products/edit-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { notFound } from "next/navigation";
import { fetchProductsbyId } from "@/app/lib/data";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const product = await fetchProductsbyId(id);
  if (!product) {
    notFound();
  }

//   console.log(product);

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
      <Form products={product ? [product] : []} />
    </main>
  );
}
