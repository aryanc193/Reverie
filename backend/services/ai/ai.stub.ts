import { createHash } from "crypto";
import {
  AiService,
  ChatReplyInput,
  ChatReplyResult,
  InsightGenerationInput,
  InsightGenerationResult,
  MemoryAnalysisInput,
  ReflectionAnalysis,
} from "./ai.interface";

const STUB_EMOTIONS = ["curious", "hopeful", "reflective", "calm", "grateful"];
const STUB_THEMES = ["growth", "relationships", "work", "health", "creativity"];

function pickFrom<T>(items: T[], seed: string, count: number): T[] {
  const hash = createHash("sha256").update(seed).digest();
  const selected: T[] = [];

  for (let i = 0; i < count; i++) {
    const index = hash[i] % items.length;
    const item = items[index];
    if (!selected.includes(item)) {
      selected.push(item);
    }
  }

  return selected;
}

function buildAnalysisSeed(input: MemoryAnalysisInput): string {
  const parts = [
    input.title ?? "",
    input.mood ?? "",
    (input.tags ?? []).join(","),
    input.richTextContent,
  ];

  return parts.join("|");
}

export class StubAiService implements AiService {
  async analyzeEntry(input: MemoryAnalysisInput): Promise<ReflectionAnalysis> {
    const seed = createHash("sha256")
      .update(buildAnalysisSeed(input))
      .digest("hex")
      .slice(0, 8);

    const moodNote = input.mood ? ` Mood: ${input.mood}.` : "";
    const tagNote =
      input.tags && input.tags.length > 0
        ? ` Tags: ${input.tags.join(", ")}.`
        : "";

    return {
      summary: `Stub reflection (${seed}).${moodNote}${tagNote}`,
      emotions: pickFrom(STUB_EMOTIONS, seed, 2),
      themes: pickFrom(STUB_THEMES, seed, 2),
    };
  }

  async embed(text: string): Promise<string> {
    return `stub-embed-${createHash("sha256").update(text).digest("hex").slice(0, 12)}`;
  }

  async generateInsight(
    input: InsightGenerationInput,
  ): Promise<InsightGenerationResult> {
    const seed = createHash("sha256")
      .update(
        input.memories
          .map((memory) => memory.id)
          .sort()
          .join(","),
      )
      .digest("hex")
      .slice(0, 8);

    const themes = [
      ...new Set(
        input.memories.flatMap((memory) => memory.themes ?? []),
      ),
    ].slice(0, 3);

    const emotions = [
      ...new Set(
        input.memories.flatMap((memory) => memory.emotions ?? []),
      ),
    ].slice(0, 3);

    const moods = [
      ...new Set(
        input.memories
          .map((memory) => memory.mood)
          .filter((mood): mood is string => Boolean(mood)),
      ),
    ];

    const themeText =
      themes.length > 0 ? themes.join(", ") : pickFrom(STUB_THEMES, seed, 2).join(", ");
    const emotionText =
      emotions.length > 0
        ? emotions.join(", ")
        : pickFrom(STUB_EMOTIONS, seed, 2).join(", ");

    return {
      title: `Weekly insight (${seed})`,
      content: `Over the last ${input.lookbackDays} days, you wrote ${input.memories.length} entries. Recurring themes: ${themeText}. Emotional tone: ${emotionText}.${moods.length > 0 ? ` Moods logged: ${moods.join(", ")}.` : ""}`,
    };
  }

  async generateChatReply(input: ChatReplyInput): Promise<ChatReplyResult> {
    const seed = createHash("sha256")
      .update(input.userMessage)
      .digest("hex")
      .slice(0, 8);

    const memoryNote =
      input.recentMemories.length > 0
        ? ` I noticed themes in your recent entries (${input.recentMemories
            .slice(0, 3)
            .map((memory) => memory.title || "untitled entry")
            .join(", ")}).`
        : " I don't have much journal context yet, but I'm here to reflect with you.";

    const promptEcho = input.userMessage.slice(0, 120);

    return {
      content: `Stub companion (${seed}): thanks for sharing "${promptEcho}".${memoryNote} What feels most important about that right now?`,
    };
  }
}

export const stubAiService = new StubAiService();
