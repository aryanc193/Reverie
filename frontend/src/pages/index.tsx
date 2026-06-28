import { useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useChat } from "@/hooks/useChat";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ChatCard from "@/components/dashboard/ChatCard";
import ChatThread from "@/components/dashboard/ChatThread";
import JournalCard from "@/components/dashboard/JournalCard";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useRequireAuth();
  const [entryTitle, setEntryTitle] = useState("Untitled entry");
  const [entryBody, setEntryBody] = useState("");
  const [chatQuery, setChatQuery] = useState("");

  const {
    messages,
    isSending,
    error: chatError,
    isThreadOpen,
    sendMessage,
    closeThread,
    clearError,
  } = useChat();

  if (isLoading || !isAuthenticated || !user) return null;

  async function handleSend() {
    const content = chatQuery;
    setChatQuery("");
    clearError();
    await sendMessage(content);
  }

  return (
    <DashboardShell user={user}>
      <ChatCard
        value={chatQuery}
        onChange={(v) => {
          clearError();
          setChatQuery(v);
        }}
        onSend={() => void handleSend()}
        isSending={isSending}
        error={chatError}
      />
      <JournalCard
        title={entryTitle}
        body={entryBody}
        onTitleChange={setEntryTitle}
        onBodyChange={setEntryBody}
      />
      <ChatThread
        messages={messages}
        isOpen={isThreadOpen}
        isSending={isSending}
        onClose={closeThread}
      />
    </DashboardShell>
  );
}
