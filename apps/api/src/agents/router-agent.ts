import { BillingAgent } from "./billing-agent";
import { OrderAgent } from "./order-agent";
import { SupportAgent } from "./support-agent";

export class RouterAgent {
  private supportAgent = new SupportAgent();
  private orderAgent = new OrderAgent();
  private billingAgent = new BillingAgent();

  async route(message: string) {
    const normalized = message.toLowerCase();

    if (
      normalized.includes("order") ||
      normalized.includes("tracking") ||
      normalized.includes("delivery") ||
      normalized.includes("cancel")
    ) {
      return this.orderAgent.handle({ message });
    }

    if (
      normalized.includes("invoice") ||
      normalized.includes("refund") ||
      normalized.includes("payment") ||
      normalized.includes("billing")
    ) {
      return this.billingAgent.handle({ message });
    }

    return this.supportAgent.handle({ message });
  }
}
