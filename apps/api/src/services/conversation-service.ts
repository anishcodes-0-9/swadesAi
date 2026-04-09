import { eq, asc, desc } from "drizzle-orm";
import { db, conversations, messages } from "../lib/db";

export class ConversationService {
  async listConversations() {
    return db.select().from(conversations).orderBy(desc(conversations.updatedAt));
  }

  async getConversation(id: string) {
    const conversation = await db.select().from(conversations).where(eq(conversations.id, id));
    const conversationMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));

    return {
      conversation: conversation[0] ?? null,
      messages: conversationMessages
    };
  }

  async createConversationIfNeeded(conversationId?: string, firstMessage?: string) {
    if (conversationId) {
      return conversationId;
    }

    const title = firstMessage?.trim()
      ? firstMessage.trim().slice(0, 40)
      : "New chat";

    const created = await db
      .insert(conversations)
      .values({
        customerName: "Demo User",
        customerEmail: "demo@example.com",
        title,
        updatedAt: new Date()
      })
      .returning();

    return created[0].id;
  }

  async addMessage(input: {
    conversationId: string;
    role: string;
    content: string;
  }) {
    const inserted = await db.insert(messages).values(input).returning();

    await db
      .update(conversations)
      .set({
        updatedAt: new Date()
      })
      .where(eq(conversations.id, input.conversationId));

    return inserted[0];
  }

  async deleteConversation(id: string) {
    const existing = await db.select().from(conversations).where(eq(conversations.id, id));

    if (!existing[0]) {
      return { deleted: false, id, notFound: true };
    }

    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));

    return { deleted: true, id };
  }
}
