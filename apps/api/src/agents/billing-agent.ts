import { db, invoices, payments } from "../lib/db";
import { desc } from "drizzle-orm";

export class BillingAgent {
  async handle(input: { message: string }) {
    const latestInvoice = await db.select().from(invoices).orderBy(desc(invoices.issuedAt)).limit(1);
    const latestPayment = await db.select().from(payments).orderBy(desc(payments.createdAt)).limit(1);

    return {
      agent: "billing",
      response:
        latestInvoice.length > 0 && latestPayment.length > 0
          ? `Latest invoice ${latestInvoice[0].invoiceNumber} is ${latestInvoice[0].status}, and the latest payment is ${latestPayment[0].status}.`
          : "I could not find enough billing data yet.",
      reasoning: ["Classified as billing-related query", "Fetched invoices and payments from database"],
      data: {
        invoice: latestInvoice[0] ?? null,
        payment: latestPayment[0] ?? null
      }
    };
  }
}
