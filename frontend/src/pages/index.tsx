import { useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useChat } from "@/hooks/useChat";
import { useJournal } from "@/hooks/useJournal";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ChatCard from "@/components/dashboard/ChatCard";
import ChatThread from "@/components/dashboard/ChatThread";
import JournalCard from "@/components/dashboard/JournalCard";
import JournalFullscreen from "@/components/journal/JournalFullscreen";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useRequireAuth();
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

  const {
    isFullscreen,
    title,
    htmlContent,
    previewText,
    saveStatus,
    openFullscreen,
    closeFullscreen,
    handleTitleChange,
    handleContentChange,
  } = useJournal();

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
        title={title}
        previewText={previewText}
        onTitleChange={handleTitleChange}
        onExpand={openFullscreen}
      />
      <ChatThread
        messages={messages}
        isOpen={isThreadOpen}
        isSending={isSending}
        onClose={closeThread}
      />
      <JournalFullscreen
        isOpen={isFullscreen}
        title={title}
        htmlContent={htmlContent}
        saveStatus={saveStatus}
        onTitleChange={handleTitleChange}
        onContentChange={handleContentChange}
        onClose={closeFullscreen}
      />
    </DashboardShell>
  );
}
