import type { ConversationMessage } from "@/lib/api/conversations";
import styles from "@/styles/Dashboard.module.css";

interface ChatThreadProps {
  messages: ConversationMessage[];
  isOpen: boolean;
  isSending: boolean;
  onClose: () => void;
}

export default function ChatThread({ messages, isOpen, isSending, onClose }: ChatThreadProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.threadOverlay} role="dialog" aria-label="Chat thread" aria-modal="true">
      <div className={styles.threadBackdrop} onClick={onClose} aria-hidden />
      <div className={styles.threadPanel}>
        <header className={styles.threadHeader}>
          <h2 className={styles.threadTitle}>Chat with memories</h2>
          <button type="button" className={styles.threadClose} onClick={onClose} aria-label="Close chat">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className={styles.threadMessages}>
          {messages.length === 0 && !isSending && (
            <p className={styles.threadEmpty}>Start a conversation about your memories.</p>
          )}
          {messages.map((msg, i) => (
            <div
              key={`${msg.createdAt}-${i}`}
              className={`${styles.threadMessage} ${msg.role === "user" ? styles.threadMessageUser : styles.threadMessageAssistant}`}
            >
              <span className={styles.threadRole}>{msg.role === "user" ? "You" : "Reverie"}</span>
              <p className={styles.threadContent}>{msg.content}</p>
            </div>
          ))}
          {isSending && (
            <div className={`${styles.threadMessage} ${styles.threadMessageAssistant}`}>
              <span className={styles.threadRole}>Reverie</span>
              <p className={styles.threadTyping}>Thinking…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
