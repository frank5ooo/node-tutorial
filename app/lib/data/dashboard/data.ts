import { formatCurrency } from "../../utils";
import { prisma } from "../../prisma";

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log("Fetching revenue data...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // const data = await sql<Revenue[]>`SELECT * FROM revenue`;
    const data = await prisma.revenue.findMany();
    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await prisma.invoice.findMany({
      orderBy: {
        date: "desc",
      },
      take: 5,
      select: {
        id: true,
        customer: {
          select: {
            name: true,
            email: true,
            image_url: true,
          },
        },
        products: {
          select: {
            price: true,
          },
        },
      },
    });

    const latestInvoices = data.map((invoice) => {
      const total = invoice.products.reduce(
        (sum, product) => sum + product.price,
        0
      );
      return {
        ...invoice,
        price: formatCurrency(total),
      };
    });

    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  try {
    const invoiceCountPromise = await prisma.invoice.count();
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
      if (invoice.status === "paid") {
        paid += total;
      } else if (invoice.status === "pending") {
        pending += total;
      }
    }

    return {
      numberOfInvoices: customerCountPromise,
      numberOfCustomers: invoiceCountPromise,
      totalPaidInvoices: formatCurrency(paid),
      totalPendingInvoices: formatCurrency(pending),
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}