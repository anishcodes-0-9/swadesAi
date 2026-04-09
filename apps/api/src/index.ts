import "./lib/env";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { errorHandler } from "./middleware/error-handler";
import healthRoutes from "./routes/health";
import agentRoutes from "./routes/agents";
import conversationRoutes from "./routes/conversations";
import messageRoutes from "./routes/messages";
import messageStreamRoutes from "./routes/message-stream";

const app = new Hono();
const port = Number(process.env.PORT || 3001);

app.use("*", logger());
app.use("*", cors());
app.use("*", errorHandler);

app.route("/health", healthRoutes);
app.route("/agents", agentRoutes);
app.route("/conversations", conversationRoutes);
app.route("/messages", messageRoutes);
app.route("/messages/stream", messageStreamRoutes);

app.get("/", (c) => c.json({ name: "SwadesAI API", status: "ok" }));

serve(
  {
    fetch: app.fetch,
    port
  },
  (info) => {
    console.log(`API running on http://localhost:${info.port}`);
  }
);
