import type { Conversation, ConversationResponse } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export async function fetchConversations(): Promise<Conversation[]> {
  const response = await fetch(`${API_BASE}/conversations`);
  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }

  const data = await response.json();
  return data.conversations;
}

export async function fetchConversation(
  id: string,
): Promise<ConversationResponse> {
  const response = await fetch(`${API_BASE}/conversations/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch conversation");
  }

  return response.json();
}

export async function streamMessage(input: {
  conversationId?: string;
  content: string;
}) {
  const response = await fetch(`${API_BASE}/messages/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to stream message");
  }

  return response;
}
