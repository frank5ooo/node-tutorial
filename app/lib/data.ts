import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  ProductsField,
} from './definitions';
import { formatCurrency } from './utils';
import { prisma } from './prisma';
import { tree } from 'next/dist/build/templates/app-page';
import { tuple } from 'zod';

const sql = postgres(process.env.POSTGRES_URL1!, { ssl: 'require' });

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    // const data = await sql<Revenue[]>`SELECT * FROM revenue`;
    const data = await prisma.revenue.findMany();
    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() 
{
  try 
  {
    // const data = await sql<LatestInvoiceRaw[]>`
    //   SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
    //   FROM invoices
    //   JOIN customers ON invoices.customer_id = customers.id
    //   ORDER BY invoices.date DESC
    //   LIMIT 5`;
    
    const data = await prisma.invoice.findMany({
      orderBy: {
        date: 'desc',
      },
      take: 5,
      select: {
        id: true,
        customer: {
          select: {
            name: true,
            email: true,
            image_url: true,

          }
        },
        products:{
          select: {
            price:true,
          }
        }
      }
    });

    const latestInvoices = data.map((invoice) => {
      const total = invoice.products.reduce((sum, product) => sum + product.price, 0);
      return {
        ...invoice,
        price: formatCurrency(total),
      };
    });

    return latestInvoices;
  } 
  catch (error) 
  {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() 
{
  try 
  {
    const invoiceCountPromise  = await prisma.invoice.count();
    const customerCountPromise = await prisma.customer.count();

    const invoices = await prisma.invoice.findMany({
      select: {
        status: true,
        products: {
          select: {
            price: true,
          },
        },
      },
    });

    let paid = 0;
    let pending = 0;

    for (const invoice of invoices) {
      const total = invoice.products.reduce((acc, p) => acc + p.price, 0);
      if (invoice.status === 'paid') {
        paid += total;
      } else if (invoice.status === 'pending') {
        pending += total;
      }
    }

    return {
      numberOfInvoices: customerCountPromise,
      numberOfCustomers: invoiceCountPromise,
      totalPaidInvoices: formatCurrency(paid),
      totalPendingInvoices: formatCurrency(pending),
    };
  } 
  catch (error) 
  {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(query: string,currentPage: number)
{
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { date: 'desc' },
      take: ITEMS_PER_PAGE,
      skip: offset,
      include: 
      {
        customer: true,
        products: {
          select:{
            id:true,
            price:true,
          }
        }

      },
      where: 
      {
        OR: 
        [
          { customer: { name: { contains: query, mode: 'insensitive' } } },
          { customer: { email: { contains: query, mode: 'insensitive' } } },
          { 
            products: {
              some: {
                price: {
                  equals: Number(query) || undefined,
                },
              },
            },
          },
          { date: { equals: new Date() || undefined } },
          { status: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return invoices;
  } 
  catch (error) 
  {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}
export async function fetchFilteredProducts(query: string,currentPage: number)
{
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const products = await prisma.product.findMany({
      take: ITEMS_PER_PAGE,
      skip: offset,
      where: 
      {
        OR: 
        [
          { name: { contains: query, mode: 'insensitive' } },
          { price: { equals: Number(query)} },
          // { status: { contains: query, mode: 'insensitive' } },
        ],
      },
      
    });
    return products;
  } 
  catch (error) 
  {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchProductPages(query: string) 
{
  try 
  {
    const data = await prisma.invoice.count({
      where:{
        OR: 
        [
          { customer: { name: { contains: query, mode: 'insensitive' } } },
          { customer: { email: { contains: query, mode: 'insensitive' } } },
          // { amount: { equals: Number(query) || undefined } },
          { date: { equals: new Date() || undefined } },
          { status: { contains: query, mode: 'insensitive' } },
        ],
      }
    });

    const totalPages = Math.ceil(Number(data) / ITEMS_PER_PAGE);
    return totalPages;
  } 
  catch (error) 
  {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}


export async function fetchInvoicesPages(query: string) 
{
  try 
  {
    // const data = await sql`SELECT COUNT(*)
    // FROM invoices
    // JOIN customers ON invoices.customer_id = customers.id
    // WHERE
    //   customers.name ILIKE ${`%${query}%`} OR
    //   customers.email ILIKE ${`%${query}%`} OR
    //   invoices.amount::text ILIKE ${`%${query}%`} OR
    //   invoices.date::text ILIKE ${`%${query}%`} OR
    //   invoices.status ILIKE ${`%${query}%`}
    // `;

    const data = await prisma.invoice.count({
      where:{
        OR: 
        [
          { customer: { name: { contains: query, mode: 'insensitive' } } },
          { customer: { email: { contains: query, mode: 'insensitive' } } },
          // { amount: { equals: Number(query) || undefined } },
          { date: { equals: new Date() || undefined } },
          { status: { contains: query, mode: 'insensitive' } },
        ],
      }
    });

    const totalPages = Math.ceil(Number(data) / ITEMS_PER_PAGE);
    return totalPages;
  } 
  catch (error) 
  {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string): Promise<InvoiceForm | null> 
{
  try 
  {
    const data = await prisma.invoice.findUnique({
      where: { id },
      select: {
        id: true,
        customer_id: true,
        status: true,
        date: true,
      },
    });

    if (!data) return null;

    return {
      id: data.id,
      customer_id: data.customer_id,
      // amount: data.amount / 100, 
      status: data.status as 'pending' | 'paid',
      date: data.date.toISOString().split('T')[0], 
    };
  } 
  catch (error) 
  {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    // const customers = await sql<CustomerField[]>`
    //   SELECT
    //     id,
    //     name
    //   FROM customers
    //   ORDER BY name ASC
    // `;
    const customers = await prisma.customer.findMany({
      select:
      {
        id:true,
        name: true,
      },
      orderBy:{
        name: "asc",
      }

    });

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchProducts() {
  try {
    const product = await prisma.product.findMany({
      select:
      {
        id:true,
        name: true,
        invoice_id: true,
      },
      orderBy:{
        name: "asc",
      }
    });

    return product;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all product.');
  }
}

export async function fetchFilteredCustomers(query: string) 
{
  try 
  {
    const filters: any[] = [];
    
    if (query && query.trim() !== '') 
    {
      filters.push(
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } }
      );
    }

    const data = await prisma.customer.findMany({
      where: 
      {
        OR: [
          { name:  { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive'} },
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        image_url: true,
        invoices: 
        {
          select: 
          {
            status: true,
            products: 
            {
              select: 
              {
                price:true,
              },
            },
          },
        },
      },
      orderBy:
      {
        name: 'asc'
      },
    });

    data.map((customer) => {
      const totalInvoices = customer.invoices.length;
      const totalPending = customer.invoices
        .filter((i) => i.status === 'pending')
        .reduce((sum, i) => sum + i.products.reduce((pSum, p) => pSum + p.price, 0), 0);
      const totalPaid = customer.invoices
        .filter((i) => i.status === 'paid')
        .reduce((sum, i) => sum + i.products.reduce((pSum, p) => pSum + p.price, 0), 0);

      return {
        ...customer,
        totalInvoices,
        totalPending,
        totalPaid,
      };
    });
  } 
  catch (err) 
  {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}