import { createHash } from "crypto";
import {
  AiService,
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
}

export const stubAiService = new StubAiService();
