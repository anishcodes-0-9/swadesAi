import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { ConversationService } from "../services/conversation-service";
import { RouterAgent } from "../agents/router-agent";

const conversationService = new ConversationService();
const routerAgent = new RouterAgent();

export class StreamMessageController {
  async streamMessage(input: { conversationId?: string; content: string }) {
    const conversationId = await conversationService.createConversationIfNeeded(
      input.conversationId,
      input.content
    );

    await conversationService.addMessage({
      conversationId,
      role: "user",
      content: input.content
    });

    const routed = await routerAgent.route(input.content);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system:
        `You are the ${routed.agent} agent in a customer support system. ` +
        `Use the provided routed context and answer clearly, briefly, and helpfully.`,
      prompt:
        `User message:\n${input.content}\n\n` +
        `Routed reasoning:\n${routed.reasoning.join("\n")}\n\n` +
        `Grounding data:\n${JSON.stringify("data" in routed ? routed.data : null, null, 2)}\n\n` +
        `Draft answer to refine:\n${routed.response}`
    });

    return {
      conversationId,
      agent: routed.agent,
      reasoning: routed.reasoning,
      result
    };
  }
}
