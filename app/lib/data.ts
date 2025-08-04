import { formatCurrency } from './utils';
import { prisma } from './prisma';

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
    const data = await prisma.invoice.findMany({
      orderBy: 
      {
        date: 'desc',
      },
      take: 5,
      select: 
      {
        id: true,
        customer:
        {
          select: 
          {
            name: true,
            email: true,
            image_url: true,
          }
        },
        products:
        {
          select: 
          {
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
  const maybePrice = Number(query)*100;
  const isNumber = !isNaN(maybePrice);

  try 
  {
    const invoices = await prisma.invoice.findMany({
      orderBy: { date: 'desc' },
      take: ITEMS_PER_PAGE,
      skip: offset,
      include: 
      {
        customer: true,
        products: true,
      },
      where: 
      {
        OR: 
        [
          { customer: { name: { contains: query, mode: 'insensitive' } } },
          { customer: { email: { contains: query, mode: 'insensitive' } } },
          { status: { contains: query, mode: 'insensitive' } },
          ...(isNumber
            ? [{
                products: {
                  some: {
                    price: {
                      equals: maybePrice
                    }
                  }
                }
              }]
            : [])
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
  const maybePrice = Number(query)*100;
  const isNumber = !isNaN(maybePrice);

  try 
  {
    const products = await prisma.product.findMany({
      take: ITEMS_PER_PAGE,
      skip: offset,
      where: 
      {
        OR: 
        [
          { name: { contains: query, mode: 'insensitive' } },
          ...(isNumber
            ? [
                {price: {
                  equals: maybePrice
                }}
              ]
            : [])
        ],
      },
      
    });

    // console.debug(query);
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
    const data = await prisma.product.count({
      where:
      {
        name: { contains: query, mode: 'insensitive'},  
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
    const data = await prisma.invoice.count({
      where:{
        OR: 
        [
          { customer: { name: { contains: query, mode: 'insensitive' } } },
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

export async function fetchInvoiceById(id: string)
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
        products: true,
      },
    });

    if (!data) return null;

    return data;
  } 
  catch (error) 
  {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() 
{
  try 
  {
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

export async function fetchProducts() 
{
  try 
  {
    const product = await prisma.product.findMany({
      where:
      {
        invoice_id: null,
      },
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
  } 
  catch (err) 
  {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all product.');
  }
}

export async function fetchProductsbyId(id: string)
{
  try 
  {
    const data = await prisma.product.findMany({
      where:
      {
        OR:[
          {invoice_id: null},
          {invoice_id: id},
        ]
      },
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

    return data
  } 
  catch (err) 
  {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all product.');
  }
}