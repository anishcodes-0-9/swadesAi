import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { db, invoices, payments } from "../lib/db";
import { desc } from "drizzle-orm";

export class BillingAgent {
  async handle(input: { message: string }) {
    const latestInvoices = await db
      .select()
      .from(invoices)
      .orderBy(desc(invoices.issuedAt))
      .limit(3);

    const latestPayments = await db
      .select()
      .from(payments)
      .orderBy(desc(payments.createdAt))
      .limit(3);

    const invoiceContext =
      latestInvoices.length > 0
        ? latestInvoices
            .map(
              (invoice) =>
                `Invoice Number: ${invoice.invoiceNumber}
Status: ${invoice.status}
Amount: ${invoice.amount}
Issued At: ${invoice.issuedAt}`
            )
            .join("\n\n")
        : "No invoices found.";

    const paymentContext =
      latestPayments.length > 0
        ? latestPayments
            .map(
              (payment) =>
                `Payment ID: ${payment.id}
Status: ${payment.status}
Method: ${payment.paymentMethod}
Amount: ${payment.amount}
Created At: ${payment.createdAt}`
            )
            .join("\n\n")
        : "No payments found.";

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system:
        "You are a billing support agent. Answer clearly and briefly using only the billing data provided. If data is missing, say so honestly.",
      prompt: `User message:
${input.message}

Available invoice data:
${invoiceContext}

Available payment data:
${paymentContext}`
    });

    return {
      agent: "billing",
      response: result.text,
      reasoning: [
        "Classified as billing-related query",
        "Fetched invoices and payments from database",
        "Generated grounded billing response with AI"
      ],
      data: {
        invoices: latestInvoices,
        payments: latestPayments
      }
    };
  }
}
