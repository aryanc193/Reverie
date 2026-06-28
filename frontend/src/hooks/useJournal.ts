import { useCallback, useEffect, useRef, useState } from "react";
import * as memoriesApi from "@/lib/api/memories";
import { getAccessToken } from "@/lib/auth/storage";
import { ApiError } from "@/lib/api/client";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

function htmlToPreview(html: string): string {
  if (!html.trim()) return "";
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, 280);
}

export function useJournal() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [title, setTitle] = useState("Untitled entry");
  const [htmlContent, setHtmlContent] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [memoryId, setMemoryId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(
    async (nextTitle: string, nextHtml: string) => {
      const token = getAccessToken();
      if (!token) return;

      const stripped = nextHtml.replace(/<[^>]+>/g, "").trim();
      if (!stripped) return;

      setSaveStatus("saving");

      try {
        const payload = {
          title: nextTitle.trim() || undefined,
          richTextContent: nextHtml,
        };

        if (memoryId) {
          await memoriesApi.updateMemory(token, memoryId, payload);
        } else {
          const memory = await memoriesApi.createMemory(token, payload);
          setMemoryId(memory._id);
        }

        setPreviewText(htmlToPreview(nextHtml));
        setSaveStatus("saved");
      } catch (err) {
        setSaveStatus("error");
        if (err instanceof ApiError) {
          console.error(err.message);
        }
      }
    },
    [memoryId],
  );

  const scheduleSave = useCallback(
    (nextTitle: string, nextHtml: string) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void persist(nextTitle, nextHtml);
      }, 800);
    },
    [persist],
  );

  const handleContentChange = useCallback(
    (nextHtml: string) => {
      setHtmlContent(nextHtml);
      scheduleSave(title, nextHtml);
    },
    [title, scheduleSave],
  );

  const handleTitleChange = useCallback(
    (nextTitle: string) => {
      setTitle(nextTitle);
      if (htmlContent.replace(/<[^>]+>/g, "").trim()) {
        scheduleSave(nextTitle, htmlContent);
      }
    },
    [htmlContent, scheduleSave],
  );

  const openFullscreen = useCallback(() => {
    setIsFullscreen(true);
  }, []);

  const closeFullscreen = useCallback(() => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      void persist(title, htmlContent);
    }
    setIsFullscreen(false);
  }, [title, htmlContent, persist]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  return {
    isFullscreen,
    title,
    htmlContent,
    previewText,
    saveStatus,
    openFullscreen,
    closeFullscreen,
    handleTitleChange,
    handleContentChange,
  };
}
