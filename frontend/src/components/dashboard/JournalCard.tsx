import styles from "@/styles/Dashboard.module.css";

interface JournalCardProps {
  title: string;
  body: string;
  onTitleChange: (value: string) => void;
  onBodyChange: (value: string) => void;
}

export default function JournalCard({
  title,
  body,
  onTitleChange,
  onBodyChange,
}: JournalCardProps) {
  return (
    <section className={styles.notePanel} aria-label="Journal entry">
      <span className={`${styles.noteDot} ${styles.noteDotLeft}`} />
      <span className={`${styles.noteDot} ${styles.noteDotRight}`} />

      <input
        className={styles.noteTitle}
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        aria-label="Entry title"
      />
      <textarea
        className={styles.noteBody}
        value={body}
        onChange={(e) => onBodyChange(e.target.value)}
        placeholder="Start writing your thoughts..."
        aria-label="Entry content"
      />
    </section>
  );
}
