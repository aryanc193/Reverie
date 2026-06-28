import { useCallback, useState } from "react";
import * as conversationsApi from "@/lib/api/conversations";
import { getAccessToken } from "@/lib/auth/storage";
import { ApiError } from "@/lib/api/client";

export function useChat() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<conversationsApi.ConversationMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isThreadOpen, setIsThreadOpen] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const token = getAccessToken();
    if (!token) return;

    const trimmed = content.trim();
    if (!trimmed) return;

    setError(null);
    setIsSending(true);
    setIsThreadOpen(true);

    const optimisticUser: conversationsApi.ConversationMessage = {
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUser]);

    try {
      let id = conversationId;
      if (!id) {
        const created = await conversationsApi.createConversation(token);
        id = created._id;
        setConversationId(id);
      }

      const conversation = await conversationsApi.appendMessage(token, id, trimmed);
      setMessages(conversation.messages);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m !== optimisticUser));
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to send message. Please try again.");
      }
    } finally {
      setIsSending(false);
    }
  }, [conversationId]);

  const closeThread = useCallback(() => {
    setIsThreadOpen(false);
  }, []);

  return {
    messages,
    isSending,
    error,
    isThreadOpen,
    sendMessage,
    closeThread,
    clearError: () => setError(null),
  };
}
