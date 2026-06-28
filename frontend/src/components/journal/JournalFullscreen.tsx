import dynamic from "next/dynamic";
import type { SaveStatus } from "@/hooks/useJournal";
import styles from "@/styles/Dashboard.module.css";

const JournalEditor = dynamic(() => import("./JournalEditor"), { ssr: false });

interface JournalFullscreenProps {
  isOpen: boolean;
  title: string;
  htmlContent: string;
  saveStatus: SaveStatus;
  onTitleChange: (title: string) => void;
  onContentChange: (html: string) => void;
  onClose: () => void;
}

function saveLabel(status: SaveStatus) {
  switch (status) {
    case "saving":
      return "Saving…";
    case "saved":
      return "Saved";
    case "error":
      return "Save failed";
    default:
      return "";
  }
}

export default function JournalFullscreen({
  isOpen,
  title,
  htmlContent,
  saveStatus,
  onTitleChange,
  onContentChange,
  onClose,
}: JournalFullscreenProps) {
  if (!isOpen) return null;

  const statusText = saveLabel(saveStatus);

  return (
    <div className={styles.journalOverlay} role="dialog" aria-label="Journal editor" aria-modal="true">
      <header className={styles.journalChrome}>
        <button type="button" className={styles.journalDone} onClick={onClose}>
          Done
        </button>
        {statusText && (
          <span
            className={`${styles.journalSaveStatus} ${saveStatus === "error" ? styles.journalSaveError : ""}`}
          >
            {statusText}
          </span>
        )}
      </header>

      <div className={styles.journalEditorWrap}>
        <input
          className={styles.journalFullscreenTitle}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled entry"
          aria-label="Entry title"
        />
        <JournalEditor initialHtml={htmlContent} onChange={onContentChange} />
      </div>
    </div>
  );
}
