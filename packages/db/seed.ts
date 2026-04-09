import { db, sql } from "./client";
import { conversations, messages, orders, payments, invoices } from "./schema";

async function main() {
  await db.delete(messages);
  await db.delete(conversations);
  await db.delete(invoices);
  await db.delete(payments);
  await db.delete(orders);

  const insertedOrders = await db
    .insert(orders)
    .values([
      {
        customerName: "Rahul Sharma",
        customerEmail: "rahul@example.com",
        status: "shipped",
        trackingNumber: "TRK123456",
        shippingAddress: "12 MG Road, Bengaluru",
        totalAmount: "1499.00",
      },
      {
        customerName: "Priya Nair",
        customerEmail: "priya@example.com",
        status: "processing",
        trackingNumber: null,
        shippingAddress: "88 Residency Road, Bengaluru",
        totalAmount: "899.00",
      },
      {
        customerName: "Arjun Mehta",
        customerEmail: "arjun@example.com",
        status: "delivered",
        trackingNumber: "TRK654321",
        shippingAddress: "44 Park Street, Kolkata",
        totalAmount: "2199.00",
      },
    ])
    .returning();

  await db.insert(payments).values([
    {
      orderId: insertedOrders[0].id,
      status: "paid",
      paymentMethod: "upi",
      amount: "1499.00",
    },
    {
      orderId: insertedOrders[1].id,
      status: "pending",
      paymentMethod: "card",
      amount: "899.00",
    },
    {
      orderId: insertedOrders[2].id,
      status: "paid",
      paymentMethod: "netbanking",
      amount: "2199.00",
    },
  ]);

  await db.insert(invoices).values([
    {
      orderId: insertedOrders[0].id,
      invoiceNumber: "INV-1001",
      status: "issued",
      amount: "1499.00",
    },
    {
      orderId: insertedOrders[1].id,
      invoiceNumber: "INV-1002",
      status: "issued",
      amount: "899.00",
    },
    {
      orderId: insertedOrders[2].id,
      invoiceNumber: "INV-1003",
      status: "issued",
      amount: "2199.00",
    },
  ]);

  console.log("Seed completed successfully");
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sql.end();
  });
