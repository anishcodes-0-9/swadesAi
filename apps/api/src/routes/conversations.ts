import { Hono } from "hono";
import { ConversationController } from "../controllers/conversation-controller";

const app = new Hono();
const controller = new ConversationController();

app.get("/", async (c) => {
  const conversations = await controller.list();
  return c.json({ conversations });
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await controller.getById(id);
  return c.json(result);
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await controller.remove(id);
  return c.json(result);
});

export default app;
