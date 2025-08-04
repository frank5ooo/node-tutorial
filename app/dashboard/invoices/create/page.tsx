import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchCustomers, fetchProducts } from '@/app/lib/data';

export default async function Page() 
{
  const customers = await fetchCustomers();
  const products = await fetchProducts();

  const options = products.map((product) => ({
    id: product.id.toString(),
    name: product.name,
  }));

  console.debug("options", options);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} products={options}/>
        
    </main>
  );
}