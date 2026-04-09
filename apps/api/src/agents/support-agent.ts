import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { db, messages } from "../lib/db";
import { desc } from "drizzle-orm";

export class SupportAgent {
  async handle(input: { message: string }) {
    const recentMessages = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(5);

    const context = recentMessages
      .map((message) => `${message.role}: ${message.content}`)
      .join("\n");

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system:
        "You are a helpful customer support agent. Give concise and useful support replies.",
      prompt: `Recent conversation context:\n${context}\n\nUser message:\n${input.message}`
    });

    return {
      agent: "support",
      response: result.text,
      reasoning: ["Classified as support query", "Used recent conversation context"]
    };
  }
}
