import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { BillingAgent } from "./billing-agent";
import { OrderAgent } from "./order-agent";
import { SupportAgent } from "./support-agent";

export class RouterAgent {
  private supportAgent = new SupportAgent();
  private orderAgent = new OrderAgent();
  private billingAgent = new BillingAgent();

  private fallbackRoute(message: string) {
    const normalized = message.toLowerCase();

    if (
      normalized.includes("order") ||
      normalized.includes("tracking") ||
      normalized.includes("delivery") ||
      normalized.includes("cancel")
    ) {
      return "order";
    }

    if (
      normalized.includes("invoice") ||
      normalized.includes("refund") ||
      normalized.includes("payment") ||
      normalized.includes("billing")
    ) {
      return "billing";
    }

    return "support";
  }

  async classify(message: string) {
    try {
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        system:
          "You are an intent classifier for a customer support system. Reply with exactly one word: support, order, or billing.",
        prompt: message
      });

      const intent = result.text.trim().toLowerCase();

      if (intent === "order" || intent === "billing" || intent === "support") {
        return {
          intent,
          reasoning: ["AI router classified intent"]
        };
      }

      return {
        intent: this.fallbackRoute(message),
        reasoning: ["AI router returned unexpected output", "Used keyword fallback"]
      };
    } catch {
      return {
        intent: this.fallbackRoute(message),
        reasoning: ["AI router failed", "Used keyword fallback"]
      };
    }
  }

  async route(message: string) {
    const classified = await this.classify(message);

    if (classified.intent === "order") {
      const result = await this.orderAgent.handle({ message });
      return {
        ...result,
        reasoning: [...classified.reasoning, ...result.reasoning]
      };
    }

    if (classified.intent === "billing") {
      const result = await this.billingAgent.handle({ message });
      return {
        ...result,
        reasoning: [...classified.reasoning, ...result.reasoning]
      };
    }

    const result = await this.supportAgent.handle({ message });
    return {
      ...result,
      reasoning: [...classified.reasoning, ...result.reasoning]
    };
  }
}
