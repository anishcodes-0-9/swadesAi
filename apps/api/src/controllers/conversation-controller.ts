import { ConversationService } from "../services/conversation-service";

const conversationService = new ConversationService();

export class ConversationController {
  async list() {
    return conversationService.listConversations();
  }

  async getById(id: string) {
    return conversationService.getConversation(id);
  }

  async remove(id: string) {
    return conversationService.deleteConversation(id);
  }
}
