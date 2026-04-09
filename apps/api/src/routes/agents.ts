import { Hono } from "hono";

const app = new Hono();

const agents = [
  {
    type: "router",
    name: "Router Agent",
    description: "Classifies customer intent and delegates to the correct sub-agent"
  },
  {
    type: "support",
    name: "Support Agent",
    description: "Handles general support, FAQs, and troubleshooting"
  },
  {
    type: "order",
    name: "Order Agent",
    description: "Handles order status, tracking, and cancellations"
  },
  {
    type: "billing",
    name: "Billing Agent",
    description: "Handles invoices, payments, and refunds"
  }
];

app.get("/", (c) => c.json({ agents }));

app.get("/:type/capabilities", (c) => {
  const type = c.req.param("type");

  const capabilities: Record<string, string[]> = {
    router: ["intent-classification", "agent-delegation", "fallback-handling"],
    support: ["faq-answering", "conversation-history-lookup", "troubleshooting"],
    order: ["order-status-lookup", "tracking-check", "cancellation-support"],
    billing: ["invoice-lookup", "payment-status-check", "refund-support"]
  };

  return c.json({
    type,
    capabilities: capabilities[type] ?? []
  });
});

export default app;
