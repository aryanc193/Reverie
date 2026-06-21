import { createHash } from "crypto";
import { AiService, ReflectionAnalysis } from "./ai.interface";

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

export class StubAiService implements AiService {
  async analyzeEntry(content: string): Promise<ReflectionAnalysis> {
    const seed = createHash("sha256").update(content).digest("hex").slice(0, 8);

    return {
      summary: `Stub reflection for entry ${seed}`,
      emotions: pickFrom(STUB_EMOTIONS, seed, 2),
      themes: pickFrom(STUB_THEMES, seed, 2),
    };
  }

  async embed(text: string): Promise<string> {
    return `stub-embed-${createHash("sha256").update(text).digest("hex").slice(0, 12)}`;
  }
}

export const stubAiService = new StubAiService();
