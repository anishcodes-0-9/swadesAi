import { Hono } from "hono";
import { StreamMessageController } from "../controllers/stream-message-controller";
import { ConversationService } from "../services/conversation-service";

const app = new Hono();
const controller = new StreamMessageController();
const conversationService = new ConversationService();

app.post("/", async (c) => {
  const body = await c.req.json();

  if (!body.content || typeof body.content !== "string") {
    return c.json({ error: "content is required" }, 400);
  }

  const { conversationId, result } = await controller.streamMessage({
    conversationId: body.conversationId,
    content: body.content
  });

  const fullText = await result.text;

  await conversationService.addMessage({
    conversationId,
    role: "assistant",
    content: fullText
  });

  const response = result.toTextStreamResponse();
  response.headers.set("x-conversation-id", conversationId);
  return response;
});

export default app;
