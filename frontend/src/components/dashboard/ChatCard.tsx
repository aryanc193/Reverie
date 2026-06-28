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

interface ChatCardProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ChatCard({ value, onChange }: ChatCardProps) {
  return (
    <section className={styles.chatPanel} aria-label="Chat with memories">
      <div className={styles.modelRow}>
        <span className={styles.modelLabel}>Gemini Flash 2.0</span>
        <ChevronDown />
      </div>
      <input
        className={styles.chatInput}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Chat with your memories..."
        aria-label="Chat with your memories"
      />
    </section>
  );
}
