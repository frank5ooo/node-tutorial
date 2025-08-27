import { UpdateProduct } from "@/app/ui/products/buttons/buttons";
import ProductStatus from "@/app/ui/products/status";
import { formatCurrency } from "@/app/lib/utils";
import { fetchFilteredProducts } from "@/app/lib/data/filter/fetch-filtered-products";
import { DeleteProduct } from "./buttons/deleteButtons";
import OrderStatus from "./orderStatusProducts";
export default async function ProductsTable({
  query,
  currentPage,
  status,
}: {
  query: string;
  currentPage: number;
  status?: string;
}) {
  console.log(status);
  const products = await fetchFilteredProducts({ query, currentPage, status });

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Product
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <div className="relative">
                    <OrderStatus />
                  </div>
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products.data?.map((product) => (
                <tr
                  key={product.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{product.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(Number(product.price))}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <ProductStatus invoice_id={product.invoice_id} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateProduct id={product.id} />
                      <DeleteProduct
                        id={product.id}
                        invoice_id={product.invoice_id}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
