import { Hono } from "hono";
import { MessageController } from "../controllers/message-controller";

const app = new Hono();
const controller = new MessageController();

app.post("/", async (c) => {
  const body = await c.req.json();

  if (!body.content || typeof body.content !== "string") {
    return c.json({ error: "content is required" }, 400);
  }

  const result = await controller.sendMessage({
    conversationId: body.conversationId,
    content: body.content
  });

  return c.json(result);
});

export default app;
