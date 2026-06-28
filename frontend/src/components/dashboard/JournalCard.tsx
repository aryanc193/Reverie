import styles from "@/styles/Dashboard.module.css";

interface JournalCardProps {
  title: string;
  previewText: string;
  onTitleChange: (value: string) => void;
  onExpand: () => void;
}

export default function JournalCard({
  title,
  previewText,
  onTitleChange,
  onExpand,
}: JournalCardProps) {
  return (
    <section
      className={styles.notePanel}
      aria-label="Journal entry"
      onClick={onExpand}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onExpand();
      }}
      role="button"
      tabIndex={0}
    >
      <span className={`${styles.noteDot} ${styles.noteDotLeft}`} />
      <span className={`${styles.noteDot} ${styles.noteDotRight}`} />

      <input
        className={styles.noteTitle}
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onFocus={onExpand}
        onClick={(e) => e.stopPropagation()}
        aria-label="Entry title"
      />
      <p className={styles.notePreview}>
        {previewText || "Start writing your thoughts…"}
      </p>
    </section>
  );
}
