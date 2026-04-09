import { FormEvent, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";
import { fetchConversation, fetchConversations, streamMessage } from "./api";
import type { Conversation, Message } from "./types";

function trimTitle(title: string) {
  if (title.length <= 32) return title;
  return `${title.slice(0, 32)}...`;
}

function detectAgentLabel(text: string) {
  const normalized = text.toLowerCase();

  if (
    normalized.includes("invoice") ||
    normalized.includes("payment") ||
    normalized.includes("refund") ||
    normalized.includes("billing")
  ) {
    return "Billing Agent";
  }

  if (
    normalized.includes("order") ||
    normalized.includes("tracking") ||
    normalized.includes("shipping") ||
    normalized.includes("delivery")
  ) {
    return "Order Agent";
  }

  return "Support Agent";
}

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  useEffect(() => {
    void loadConversations();
  }, []);

  async function loadConversations(preferredId?: string) {
    const items = await fetchConversations();
    setConversations(items);

    const targetId =
      preferredId ?? selectedConversationId ?? items[0]?.id ?? null;

    if (targetId) {
      await handleSelectConversation(targetId);
    } else {
      setMessages([]);
    }
  }

  async function handleSelectConversation(id: string) {
    setSelectedConversationId(id);
    setStatus("Loading conversation...");

    const data = await fetchConversation(id);
    setMessages(data.messages);
    setStatus("Ready");
  }

  function handleNewChat() {
    setSelectedConversationId(null);
    setMessages([]);
    setActiveAgent(null);
    setStatus("New chat ready");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const currentConversationId = selectedConversationId;
    const temporaryConversationId =
      currentConversationId ?? crypto.randomUUID();
    const inferredAgent = detectAgentLabel(trimmed);

    const tempUserMessage: Message = {
      id: crypto.randomUUID(),
      conversationId: temporaryConversationId,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    const tempAssistantMessage: Message = {
      id: crypto.randomUUID(),
      conversationId: temporaryConversationId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };

    setMessages([
      ...(currentConversationId ? messages : []),
      tempUserMessage,
      tempAssistantMessage,
    ]);
    setInput("");
    setIsStreaming(true);
    setActiveAgent(inferredAgent);
    setStatus(`Routing to ${inferredAgent}...`);

    try {
      const response = await streamMessage({
        conversationId: currentConversationId ?? undefined,
        content: trimmed,
      });

      const serverConversationId =
        response.headers.get("x-conversation-id") ?? currentConversationId;

      if (serverConversationId) {
        setSelectedConversationId(serverConversationId);
      }

      if (!response.ok || !response.body) {
        throw new Error("Failed to stream message");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });

        setMessages((current) => {
          const updated = [...current];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: accumulated,
          };
          return updated;
        });

        setStatus(`${inferredAgent} responding...`);
      }

      setStatus("Refreshing chats...");
      await loadConversations(serverConversationId ?? undefined);
      setStatus("Ready");
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong");
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>SwadesAI</h1>
          <p>Multi-agent customer support</p>
        </div>

        <button className="new-chat-button" onClick={handleNewChat}>
          + New Chat
        </button>

        <div className="conversation-list">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={
                conversation.id === selectedConversationId
                  ? "conversation-item active"
                  : "conversation-item"
              }
              onClick={() => void handleSelectConversation(conversation.id)}
            >
              <span className="conversation-title">
                {trimTitle(conversation.title)}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <main className="chat-panel">
        <div className="chat-header">
          <div>
            <h2>Customer Support Chat</h2>
            <p>{status}</p>
          </div>
          {activeAgent ? (
            <span className="agent-badge">{activeAgent}</span>
          ) : null}
        </div>

        <div className="message-list">
          {messages.length === 0 ? (
            <div className="empty-state">
              Start a conversation to test the router, support, order, and
              billing agents.
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user" ? "message user" : "message assistant"
                }
              >
                <div className="message-role">
                  {message.role === "user" ? "You" : "Assistant"}
                </div>
                <div className="message-body">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about orders, invoices, refunds, or support issues..."
            rows={4}
          />
          <button type="submit" disabled={isStreaming || !input.trim()}>
            {isStreaming ? "Streaming..." : "Send"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
