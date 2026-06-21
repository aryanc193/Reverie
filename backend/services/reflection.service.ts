import { Memory } from "../memory/memory.model";
import { AppError } from "../utils/api-error";
import { stubAiService } from "./ai/ai.stub";
import { findUnprocessedMemories } from "./memory.service";

const REFLECTION_VERSION = 1;

async function applyReflection(memory: InstanceType<typeof Memory>) {
  const analysis = await stubAiService.analyzeEntry(memory.richTextContent);
  const embeddingId = await stubAiService.embed(memory.richTextContent);

  memory.reflection = {
    summary: analysis.summary,
    emotions: analysis.emotions,
    themes: analysis.themes,
    processedAt: new Date(),
    version: REFLECTION_VERSION,
  };
  memory.embeddingId = embeddingId;

  await memory.save();
  return memory;
}

export async function processMemory(memoryId: string) {
  const memory = await Memory.findById(memoryId);

  if (!memory) {
    throw new AppError(404, "Memory not found");
  }

  return applyReflection(memory);
}

export async function processPendingMemories(limit = 10) {
  const pending = await findUnprocessedMemories(limit);
  const results = [];

  for (const memory of pending) {
    results.push(await applyReflection(memory));
  }

  return results;
}
