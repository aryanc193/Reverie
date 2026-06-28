import { useEffect, useRef } from "react";
import { useCreateBlockNote, BlockNoteViewRaw } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";

interface JournalEditorProps {
  initialHtml?: string;
  onChange: (html: string) => void;
}

export default function JournalEditor({ initialHtml, onChange }: JournalEditorProps) {
  const editor = useCreateBlockNote();
  const hydrated = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (hydrated.current || !initialHtml?.trim()) return;

    hydrated.current = true;
    const blocks = editor.tryParseHTMLToBlocks(initialHtml);
    editor.replaceBlocks(editor.document, blocks);
  }, [editor, initialHtml]);

  useEffect(() => {
    return editor.onChange(() => {
      const html = editor.blocksToHTMLLossy();
      onChangeRef.current(html);
    });
  }, [editor]);

  return (
    <div className="journal-editor">
      <BlockNoteViewRaw editor={editor} theme="light" />
    </div>
  );
}
