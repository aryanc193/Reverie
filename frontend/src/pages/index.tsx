import { useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ChatCard from "@/components/dashboard/ChatCard";
import JournalCard from "@/components/dashboard/JournalCard";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useRequireAuth();
  const [entryTitle, setEntryTitle] = useState("Untitled entry");
  const [entryBody, setEntryBody] = useState("");
  const [chatQuery, setChatQuery] = useState("");

  if (isLoading || !isAuthenticated || !user) return null;

  return (
    <DashboardShell user={user}>
      <ChatCard value={chatQuery} onChange={setChatQuery} />
      <JournalCard
        title={entryTitle}
        body={entryBody}
        onTitleChange={setEntryTitle}
        onBodyChange={setEntryBody}
      />
    </DashboardShell>
  );
}
