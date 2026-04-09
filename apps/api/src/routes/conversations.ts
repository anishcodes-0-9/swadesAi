import { Hono } from "hono";
import { ConversationController } from "../controllers/conversation-controller";
import { isUuid } from "../lib/validators";

const app = new Hono();
const controller = new ConversationController();

app.get("/", async (c) => {
  const conversations = await controller.list();
  return c.json({ conversations });
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");

  if (!isUuid(id)) {
    return c.json({ error: "invalid conversation id" }, 400);
  }

  const result = await controller.getById(id);

  if (!result.conversation) {
    return c.json({ error: "conversation not found" }, 404);
  }

  return c.json(result);
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");

  if (!isUuid(id)) {
    return c.json({ error: "invalid conversation id" }, 400);
  }

  const result = await controller.remove(id);

  if ("notFound" in result && result.notFound) {
    return c.json({ error: "conversation not found" }, 404);
  }

  return c.json(result);
});

export default app;
