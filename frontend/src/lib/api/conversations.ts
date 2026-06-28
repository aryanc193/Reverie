import { apiFetch } from "./client";

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  userId: string;
  title?: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
}

export function createConversation(token: string, title?: string) {
  return apiFetch<Conversation>("/conversations", {
    method: "POST",
    token,
    body: JSON.stringify(title ? { title } : {}),
  });
}

export function appendMessage(token: string, conversationId: string, content: string) {
  return apiFetch<Conversation>(`/conversations/${conversationId}/messages`, {
    method: "POST",
    token,
    body: JSON.stringify({ content }),
  });
}
