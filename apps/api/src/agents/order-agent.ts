import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { db, orders } from "../lib/db";
import { desc } from "drizzle-orm";

export class OrderAgent {
  async handle(input: { message: string }) {
    const latestOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(3);

    const orderContext =
      latestOrders.length > 0
        ? latestOrders
            .map(
              (order) =>
                `Order ID: ${order.id}
Customer: ${order.customerName}
Status: ${order.status}
Tracking: ${order.trackingNumber ?? "N/A"}
Shipping Address: ${order.shippingAddress}
Total: ${order.totalAmount}`
            )
            .join("\n\n")
        : "No orders found.";

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system:
        "You are an order support agent. Answer clearly and briefly using only the order data provided. If data is missing, say so honestly.",
      prompt: `User message:
${input.message}

Available order data:
${orderContext}`
    });

    return {
      agent: "order",
      response: result.text,
      reasoning: [
        "Classified as order-related query",
        "Fetched latest orders from database",
        "Generated grounded order response with AI"
      ],
      data: latestOrders
    };
  }
}
