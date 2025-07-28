import Form from '@/app/ui/products/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) 
{
    const params = await props.params;
    const id = params.id;
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers()
    ]);
    if (!invoice) {
        notFound();
    }

    return (
        <main>
        <Breadcrumbs
            breadcrumbs={[
            { label: 'Products', href: '/dashboard/products' },
            {
                label: 'Edit Invoice',
                href: `/dashboard/products/${id}/edit`,
                active: true,
            },
            ]}
        />
        <Form/>
        </main>
    );
}