import type { KeyboardEvent } from "react";
import styles from "@/styles/Dashboard.module.css";

function ChevronDown() {
  return (
    <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ChatCardProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isSending?: boolean;
  error?: string | null;
}

export default function ChatCard({
  value,
  onChange,
  onSend,
  isSending = false,
  error,
}: ChatCardProps) {
  const canSend = value.trim().length > 0 && !isSending;

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey && canSend) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <section className={styles.chatPanel} aria-label="Chat with memories">
      <div className={styles.modelRow}>
        <span className={styles.modelLabel}>Gemini Flash 2.0</span>
        <ChevronDown />
      </div>

      {error && <p className={styles.chatError}>{error}</p>}

      <div className={styles.chatInputRow}>
        <input
          className={styles.chatInput}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Chat with your memories..."
          aria-label="Chat with your memories"
          disabled={isSending}
        />
        <button
          type="button"
          className={`${styles.sendButton} ${canSend ? styles.sendButtonVisible : ""}`}
          onClick={onSend}
          disabled={!canSend}
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
    </section>
  );
}
