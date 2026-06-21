import { IMemory, Memory } from "../memory/memory.model";
import { env } from "../config/env";
import { AppError } from "../utils/api-error";
import { getAiService } from "./ai";
import {
  buildMemoryAnalysisText,
  claimPendingMemory,
} from "./memory.service";

const REFLECTION_VERSION = 1;

function getRetryDelayMs(attempts: number): number {
  return env.reflectionRetryBaseMs * Math.pow(2, Math.max(attempts - 1, 0));
}

function shouldRetry(memory: IMemory): boolean {
  return memory.processingAttempts < env.reflectionMaxAttempts;
}

async function markMemoryFailed(memory: IMemory, error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";

  memory.processingStatus = "failed";
  memory.processingAttempts += 1;
  memory.lastProcessingError = message;

  await memory.save();

  if (shouldRetry(memory)) {
    const retryInMs = getRetryDelayMs(memory.processingAttempts);
    console.warn(
      `Memory ${memory._id} failed (attempt ${memory.processingAttempts}/${env.reflectionMaxAttempts}). Retry in ~${retryInMs}ms.`,
    );
  } else {
    console.error(
      `Memory ${memory._id} failed permanently after ${memory.processingAttempts} attempts: ${message}`,
    );
  }
}

async function applyReflection(memory: IMemory) {
  const ai = getAiService();

  const analysis = await ai.analyzeEntry({
    title: memory.title,
    richTextContent: memory.richTextContent,
    mood: memory.mood,
    tags: memory.tags,
  });

  const embeddingId = await ai.embed(buildMemoryAnalysisText(memory));

  memory.reflection = {
    summary: analysis.summary,
    emotions: analysis.emotions,
    themes: analysis.themes,
    processedAt: new Date(),
    version: REFLECTION_VERSION,
  };
  memory.embeddingId = embeddingId;
  memory.processingStatus = "done";
  memory.processingAttempts = 0;
  memory.lastProcessingError = undefined;

  await memory.save();
  return memory;
}

export async function processMemory(memoryId: string) {
  const memory = await Memory.findById(memoryId);

  if (!memory) {
    throw new AppError(404, "Memory not found");
  }

  memory.processingStatus = "processing";
  memory.lastProcessingError = undefined;
  await memory.save();

  try {
    return await applyReflection(memory);
  } catch (error) {
    await markMemoryFailed(memory, error);
    throw error;
  }
}

export async function processNextPendingMemory() {
  const memory = await claimPendingMemory();
  if (!memory) {
    return null;
  }

  try {
    return await applyReflection(memory);
  } catch (error) {
    await markMemoryFailed(memory, error);
    return null;
  }
}

export interface ReflectionBatchResult {
  processed: IMemory[];
  failed: string[];
}

export async function processPendingMemories(
  limit = env.reflectionBatchSize,
): Promise<ReflectionBatchResult> {
  const processed: IMemory[] = [];
  const failed: string[] = [];

  for (let i = 0; i < limit; i++) {
    const memory = await claimPendingMemory();
    if (!memory) {
      break;
    }

    try {
      processed.push(await applyReflection(memory));
    } catch (error) {
      await markMemoryFailed(memory, error);
      failed.push(memory._id.toString());
    }
  }

  return { processed, failed };
}
