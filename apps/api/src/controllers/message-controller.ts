import { ConversationService } from "../services/conversation-service";
import { RouterAgent } from "../agents/router-agent";

const conversationService = new ConversationService();
const routerAgent = new RouterAgent();

export class MessageController {
  async sendMessage(input: { conversationId?: string; content: string }) {
    const conversationId = await conversationService.createConversationIfNeeded(
      input.conversationId,
      input.content
    );

    const userMessage = await conversationService.addMessage({
      conversationId,
      role: "user",
      content: input.content
    });

    const routed = await routerAgent.route(input.content);

    const assistantMessage = await conversationService.addMessage({
      conversationId,
      role: "assistant",
      content: routed.response
    });

    return {
      conversationId,
      userMessage,
      assistantMessage,
      agent: routed.agent,
      reasoning: routed.reasoning,
      data: "data" in routed ? routed.data : undefined
    };
  }
}
