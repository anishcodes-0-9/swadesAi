import { db, orders } from "../lib/db";
import { desc } from "drizzle-orm";

export class OrderAgent {
  async handle(input: { message: string }) {
    const latestOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(3);

    return {
      agent: "order",
      response:
        latestOrders.length > 0
          ? `I found ${latestOrders.length} recent order(s). Latest order status: ${latestOrders[0].status}.`
          : "I could not find any orders yet.",
      reasoning: ["Classified as order-related query", "Fetched latest orders from database"],
      data: latestOrders
    };
  }
}
