export type Conversation = {
  id: string;
  customerName: string;
  customerEmail: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type ConversationResponse = {
  conversation: Conversation | null;
  messages: Message[];
};
