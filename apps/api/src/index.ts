import "./lib/env";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import healthRoutes from "./routes/health";
import agentRoutes from "./routes/agents";
import conversationRoutes from "./routes/conversations";
import messageRoutes from "./routes/messages";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.route("/health", healthRoutes);
app.route("/agents", agentRoutes);
app.route("/conversations", conversationRoutes);
app.route("/messages", messageRoutes);

app.get("/", (c) => {
  return c.json({
    name: "SwadesAI API",
    status: "ok"
  });
});

serve(
  {
    fetch: app.fetch,
    port: 3001
  },
  (info) => {
    console.log(`API running on http://localhost:${info.port}`);
  }
);
